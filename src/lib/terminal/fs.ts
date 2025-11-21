import type { Result } from "terminal/command/command";
import { DateTime } from "luxon";

export type NodeType = "FILE" | "DIR";

export const NODE_TYPE_DIRECTORY = "DIR";
export const NODE_TYPE_FILE = "FILE";

export const ROOT_USER = "root";
export const DEFAULT_USER = "please";
export const DEFAULT_GROUP = "users";
export const DEFAULT_DIRSIZE = 4096;
export const DEFAULT_HOME_DIRECTORY = `/home/${DEFAULT_USER}`;

// other
const OR = 0b0000000100;
const OW = 0b0000000010;
const OX = 0b0000000001;

// group
const GR = 0b0000100000;
const GW = 0b0000010000;
const GX = 0b0000001000;

// user
const UR = 0b0100000000;
const UW = 0b0010000000;
const UX = 0b0001000000;

const DF = 0b1000000000;
const PERM_FLAG_ARRAY = [UR, UW, UX, GR, GW, GX, OR, OW, OX];
const PERM_FLAG_DISPLAY = ["r", "w", "x"];

const DEFAULT_FILE_PERMISSIONS = UR | UW | UX | GR | GX | OR | OX;

function numToBin(dec: number) {
	return (dec >>> 0).toString(2);
}

export function readPerms(perms: number) {}

export function displayPerms(perms: number) {
	const strBuff = new Array(10);

	strBuff[0] = (perms & DF) >> 9 == 0x01 ? "d" : "-";
	PERM_FLAG_ARRAY.forEach((flag, index) => {
		const displayablePermission =
			PERM_FLAG_DISPLAY[index % PERM_FLAG_DISPLAY.length];
		strBuff[index + 1] =
			(perms & flag) >> (8 - index) == 0x01 ? displayablePermission : "-";
	});

	return strBuff.join("");
}

export interface TermDateFormat {
	month: string;
	day: string;

	time: string;
	year: string;
}

function getReadableSize(size: number) {
	const sizes = ["", "K", "M", "G"];
	let index = 0;
	let fmt = Number.parseFloat(size.toFixed(2));

	for (; index < sizes.length; index++) {
		if (fmt > 1000.0) {
			fmt = fmt / 1024.0;
		} else {
			break;
		}
	}

	return `${fmt.toFixed(1)}${sizes[index]}`;
}

export interface ChildItem {
	perms: string;
	links: number;
	owner: string;
	group: string;
	size: string;
	mod: Date;
	name: string;
}

const PWD_CURR_NAME = ".";
const PWD_UP_NAME = "..";

function displayDirContents(dir: TreeNode) {
	const children = dir.children;
	const childCount = children.length;
	const childItems: ChildItem[] = new Array(childCount + 2);

	const dirPerms = dir.permissions;
	const dirCreator = dir.creator;
	const dirGroup = dir.group;
	const dirModified = dir.modified;
	const parent = dir.parent;
	childItems[0] = {
		perms: displayPerms(dirPerms),
		links: childCount || 1,
		owner: dirCreator,
		group: dirGroup,
		size: getReadableSize(DEFAULT_DIRSIZE),
		name: PWD_CURR_NAME,
		mod: dirModified
	};

	childItems[1] = {
		perms: displayPerms((parent?.permissions ?? DEFAULT_FILE_PERMISSIONS) | DF),
		links: parent?.children.length ?? 1,
		owner: parent?.creator ?? dirCreator,
		group: parent?.group ?? dirGroup,
		size: getReadableSize(DEFAULT_DIRSIZE),
		name: PWD_UP_NAME,
		mod: parent?.modified ?? dirModified
	};

	for (let i = 0; i < childCount; i++) {
		const child = children[i];
		childItems[i + 2] = {
			perms: displayPerms(child.permissions),
			links: child.children.length,
			owner: child.creator,
			group: child.group,
			size: getReadableSize(child.size),
			name: child.nodeName,
			mod: child.modified
		};
	}

	return childItems;
}

export const FIRST_POST_DATE = new Date(0);
export const ALIASED_DIRS = new Map<string, string>();

const FAIL_REASON_MAP = {
	NOT_FOUND: "no such file or directory",
	NOT_DIRECTORY: "not a directory",
	NOT_ALLOWED: "permission denied"
};

enum FailReason {
	NotFound,
	NotDirectory,
	NotAllowed
}

function getCanonicalPathFromAlias(alias: string): string | null {
	let path = ALIASED_DIRS.get(alias);
	return path ?? null;
}

function getFailureReason(value: string, reason: FailReason): string {
	switch (reason) {
		case FailReason.NotFound:
			return `${value}: ${FAIL_REASON_MAP.NOT_FOUND}`;
		case FailReason.NotDirectory:
			return `${value}: ${FAIL_REASON_MAP.NOT_DIRECTORY}`;
		case FailReason.NotAllowed:
			return `${value}: ${FAIL_REASON_MAP.NOT_ALLOWED}`;
	}
}

export abstract class TreeNode {
	private _nodeType: NodeType;
	private _nodeName: string;
	private _children: TreeNode[];
	private _childMap: Map<string, TreeNode>;
	private _parent: TreeNode | null;

	abstract readonly size: number;
	abstract readonly href: string;
	abstract readonly creator: string;
	abstract readonly group: string;
	abstract readonly created: Date;
	abstract readonly modified: Date;

	public readonly permissions: number;

	constructor(
		nodeName: string,
		nodeType: NodeType,
		parent: TreeNode | null = null,
		permissions: number = DEFAULT_FILE_PERMISSIONS
	) {
		this._children = new Array();
		this._childMap = new Map();

		this._nodeName = nodeName;
		this._nodeType = nodeType;
		this._parent = parent;
		this.permissions = permissions;

		if (parent) {
			parent.addChild(this);
		}
	}

	public get nodeType(): string {
		return this._nodeType.toString();
	}

	public get nodeName(): string {
		return this._nodeName;
	}

	public get children(): TreeNode[] {
		return this.isFile() ? new Array() : this._children;
	}

	public get parent(): TreeNode | null {
		return this._parent ?? null;
	}

	public get childMap(): ReadonlyMap<string, TreeNode> {
		return this._childMap;
	}

	protected addChild(node: TreeNode): void {
		if (!this.isFile()) {
			this._children.push(node);
			this._childMap.set(node.nodeName, node);
		}
	}

	protected removeChild(nodeName: string): boolean {
		const idx = this._children.findIndex((node) => node.nodeName === nodeName);
		if (idx !== -1) {
			this._children.splice(idx, 1);
			this._childMap.delete(nodeName);

			return true;
		}

		return false;
	}

	protected addChildren(nodes: TreeNode[]) {
		if (!this.isFile()) {
			this._children.push(...nodes);
		}
	}

	public isDir(): boolean {
		return this._nodeType === NODE_TYPE_DIRECTORY;
	}

	public isFile(): boolean {
		return !this.isDir();
	}

	public isRoot(): boolean {
		return this.isDir() && this._parent == null;
	}

	public getPath() {
		if (this.isRoot()) {
			return "/";
		}

		let curr = this.parent!;
		let path = [this.nodeName];

		while (!curr.isRoot()) {
			path.unshift(curr.nodeName);
			curr = curr.parent!;
		}

		path.unshift(curr.nodeName); // insert root node
		return path.join("/");
	}

	public canRead() {
		if ((this.permissions & OR) >> 2 === 0x01) {
			return true;
		} else if (
			this.creator == DEFAULT_USER &&
			(this.permissions & UR) >> 8 === 0x01
		) {
			return true;
		} else if (
			this.group == DEFAULT_GROUP &&
			(this.permissions & GR) >> 5 === 0x01
		) {
			return true;
		}

		return false;
	}

	// public canExecute() {
	//     if ((this.permissions & OX) >> 1)
	// }
}

export class FSDirectory extends TreeNode {
	size: number = DEFAULT_DIRSIZE;

	href: string;
	creator: string;
	group: string;
	created: Date;
	modified: Date;

	public displayAlias: string | null = null;

	constructor(
		nodeName: string,
		created: Date,
		parent: FSDirectory | null,
		aliases: string[] | null = null,
		creator: string = DEFAULT_USER,
		group: string = DEFAULT_GROUP,
		permissions: number = DEFAULT_FILE_PERMISSIONS
	) {
		super(nodeName, NODE_TYPE_DIRECTORY, parent ?? null, permissions | DF);

		this.creator = creator;
		this.group = group;
		this.created = created;
		this.modified = created;
		this.displayAlias = aliases ? aliases[0] : null;

		if (aliases != null && aliases.length != 0) {
			aliases.forEach((alias) => ALIASED_DIRS.set(alias, this.getPath()));
		}

		// idk if we care to build this into a full URL (i.e from parent
		// nodes) though i can see the benefits of implementing this even
		// if we don't care about it straight away.
		this.href = `/${nodeName}`;
	}

	public addSubdir(child: FSDirectory) {
		this.addChild(child);
	}

	public addSubdirs(children: FSDirectory[]) {
		this.addChildren(children);
	}

	public addFile(file: FSFile) {
		this.addChild(file);
	}

	public addFiles(files: FSFile[]) {
		this.addChildren(files);
	}

	public isDirectory() {
		return this.isDir();
	}
}

export class FSFile extends TreeNode {
	size: number;
	href: string;
	creator: string;
	group: string;
	created: Date;
	modified: Date;

	constructor(
		nodeName: string,
		parent: FSDirectory,
		created: Date,
		modified?: Date,
		size: number = 0,
		creator: string = DEFAULT_USER,
		group: string = DEFAULT_GROUP
	) {
		super(nodeName, NODE_TYPE_FILE, parent, DEFAULT_FILE_PERMISSIONS);

		this.creator = creator;
		this.group = group;
		this.created = created;
		this.modified = modified ?? created;

		this.href = `/${nodeName}`;
		this.size = size;
	}
}

export class FileSystem {
	public children: TreeNode[] = new Array();
	private _root: FSDirectory = new FSDirectory(
		"",
		new Date(FIRST_POST_DATE.toLocaleString()),
		null,
		null,
		ROOT_USER,
		ROOT_USER
	);

	public pwd: FSDirectory;
	constructor() {
		this.pwd = this.initDirectoryTree(this._root);
	}

	get root(): FSDirectory {
		return this._root;
	}

	public listDir(dir: FSDirectory) {
		return displayDirContents(dir);
	}

	public getPwd(): string {
		if (this.pwd.displayAlias != null) {
			return this.pwd.displayAlias;
		}

		return this.pwd.getPath().replace("/home/please", "~");
	}

	private getStartNode(path: string): FSDirectory {
		if (path.startsWith("../")) {
			return (this.pwd.parent as FSDirectory) ?? this.pwd;
		}

		if (path.startsWith("./") || !path.startsWith("/")) {
			return this.pwd;
		}

		return this.root;
	}

	public getNode(path: string): Result<TreeNode, string> {
		const trimmedPath =
			path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
		switch (trimmedPath) {
			case "/":
				return { output: this.root };
			case "..":
				return { output: this.pwd.parent ?? this.root };
			case ".":
				return { output: this.pwd };
		}

		let parts = path.split("/");
		let current = this.getStartNode(path);
		const aliased = getCanonicalPathFromAlias(parts[0]);
		if (aliased != null) {
			parts = aliased.split("/").concat(parts.slice(1));
		}

		if (parts[0] === "") {
			parts.shift();
		}

		// traverse child map
		for (let idx = 0; idx < parts.length; idx++) {
			if (parts[idx] === "" || parts[idx] === ".") {
				continue;
			}

			if (parts[idx] === "..") {
				current = (current.parent as FSDirectory) ?? current;
				continue;
			}

			const next = current.childMap?.get(parts[idx]);
			if (!next) {
				return {
					output: getFailureReason(path, FailReason.NotFound),
					error: true
				};
			}

			if (next.isFile() && idx < parts.length - 1) {
				return {
					output: getFailureReason(path, FailReason.NotDirectory),
					error: true
				};
			}

			current = next as FSDirectory;
		}

		if (!current.canRead()) {
			return {
				output: getFailureReason(path, FailReason.NotAllowed),
				error: true
			};
		}

		this.pwd = current;
		return { output: current };
	}

	public setPwd(path: string): Result<TreeNode, string> {
		const foundNode = this.getNode(path);
		if (!foundNode.error) {
			this.pwd = foundNode.output as FSDirectory;
		}

		return foundNode;
	}

	private initDirectoryTree(rootNode: FSDirectory): FSDirectory {
		const created = FIRST_POST_DATE;
		const homePath = new FSDirectory(
			"home",
			created,
			rootNode,
			null,
			ROOT_USER,
			ROOT_USER,
			UR | UW | UX | GR | GX | OR | OX
		);

		// ... the other filesystem directories ...

		const userPath = new FSDirectory(DEFAULT_USER, created, homePath, ["~"]);
		const postsPath = new FSDirectory("posts", created, userPath);
		["ctf", "notes", "misc"].forEach((path) => {
			return new FSDirectory(path, created, postsPath);
		});

		return userPath;
	}
}

export const TerminalFS = new FileSystem();
