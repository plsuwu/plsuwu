#!/usr/bin/env python

import argparse
import subprocess
import os
import shlex

# not perfect but functional lmaooo

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

    def conv(self, filepath, quality=95):
        global total_reduction

        webp_fname = filepath.split(".png")[0] + ".webp"
        webp_fname = webp_fname.replace(" ", "_")

        if webp_fname not in os.listdir():
            cmd = shlex.split(f"cwebp -q {quality} '{filepath}' -o {webp_fname}")

            stdout, stderr = subprocess.Popen(
                cmd, shell=False, stdout=subprocess.PIPE, stderr=subprocess.PIPE
            ).communicate()

            if stderr is not None:
                print(stderr)

            png_stat = os.stat(filepath).st_size / 1024
            webp_stat = os.stat(webp_fname).st_size / 1024

            total_reduction += (png_stat - webp_stat)

            print(f'[*] Filesize reduced from {png_stat}kB to {webp_stat}kB')

        return stdout

    def rm(self, filepath):
        cmd = shlex.split(f"rm {filepath}")
        subprocess.call(cmd)

        return f'[-] Removal ok -> {filepath}'


def main():

    cmd = Cmd()
    IMG_DIRS = ['wannahusky-report']
    # IMG_DIRS = cmd.ls()
    print(IMG_DIRS)

    for dir in IMG_DIRS:
        imgs = cmd.ls(dir)
        print(imgs)

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
[+] This will delete all files with the `.png` extension in the static dir.
    continue Y/n?
                """
            )
            if confirm.lower() in ["y", ""]:

                # for img in webp:
                for img in png:
                    filepath = f"'{dir}/{img}'"

                    res = cmd.rm(filepath)
                    print(res)

        elif len(png) > 0:
            print(
                f"""
[*] Differing number of webps ({len(webp)} webps) vs pngs ({len(png)} pngs)
                """
            )
            for img in png:
                test_webp = img.split(".png")[0]
                print(test_webp)
                print(img)
                if test_webp not in webp:
                    filepath = f"{dir}/{img}"
                    print(filepath)
                    res = cmd.conv(filepath, args.quality)
                    print(f"[ok] filepath -> {filepath}")


parser = argparse.ArgumentParser(prog="converter")
parser.add_argument("--remove", "-r", action="store_true")
parser.add_argument("--quality", "-q", action="store")

args = parser.parse_args()
remove = args.remove
quality = args.quality

total_reduction = 0  # measures total savings in kilobytes (i think idk)

if __name__ == "__main__":

    main()
    print(f'[*] Saved {total_reduction / 1024}MB overall.')
