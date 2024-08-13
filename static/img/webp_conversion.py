#!/usr/bin/env python

import argparse
import subprocess
import os
import shlex


class Cmd:
    def ls(self, *dir):
        try:
            if dir:
                res = os.listdir(*dir)
            else:
                res = os.listdir(".")
            return res

        except NotADirectoryError:
            return dir

    def conv(self, filepath, quality=75):
        webp_fname = filepath.split(".png")[0] + ".webp"
        webp_fname = webp_fname.replace(" ", "_")

        if not os.listdir().__contains__(webp_fname):
            cmd = shlex.split(f"cwebp -q {quality} '{filepath}' -o {webp_fname}")

            stdout, stderr = subprocess.Popen(
                cmd, shell=False, stdout=subprocess.PIPE, stderr=subprocess.PIPE
            ).communicate()

        return

    def rm(self, filepath):
        cmd = shlex.split(f"rm {filepath}")
        subprocess.call(cmd)

        # print(cmd)


def main():
    cmd = Cmd()
    IMG_DIRS = cmd.ls()

    for dir in IMG_DIRS:
        imgs = cmd.ls(dir)

        webp = []
        png = []

        for img in imgs:
            fname = img.replace(" ", "_")
            if fname.__contains__(".webp"):
                webp.append(img)
            elif fname.__contains__(".png"):
                png.append(img)

        if remove:
            confirm = input(
                f"""
[+] This will delete all files with the `.webp` extension in the static dir.
    continue Y/n?
                """
            )
            if confirm.lower() in ["y", ""]:

                for img in webp:
                    filepath = f"{dir}/{img}"

                    res = cmd.rm(filepath)
                    print(res)

        elif len(webp) != len(png):
            print(
                f"""
[*] Differing number of webps ({len(webp)} webps) vs pngs ({len(png)} pngs)
                """
            )
            for img in imgs:
                filepath = f"{dir}/{img}"
                res = cmd.conv(filepath)
                print(f"[ok] filepath -> {filepath}")


parser = argparse.ArgumentParser(prog="converter")
parser.add_argument("--remove", "-r", action="store_true")

args = parser.parse_args()
remove = args.remove

if __name__ == "__main__":

    main()
