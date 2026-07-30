{
  inputs = {
    utils.url = "github:numtide/flake-utils";
  };
  outputs =
    {
      self,
      nixpkgs,
      utils,
    }:
    utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
        };

        default = pkgs.buildNpmPackage {
          pname = "plsuwu";
          version = "2.0.0";
          src = ./.;

          # npmDepsHash = pkgs.lib.fakeHash;
          npmDepsHash = "sha256-cUXar/mVqEVdy2B9OzsIUTrYklIs5X0YTuYxRBzCEl4=";

          buildPhase = ''
            npm install
            npm run build -- --sourcemap

            rm -rf ./node_modules
            npm install --omit dev
          '';

          installPhase = ''
            mkdir -p $out
            cp -R ./node_modules $out/
            cp -R ./dist $out/
          '';
        };

      in
      {
        packages = {
          inherit default;
        };

        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs
            bun
            pnpm
            typescript-language-server
            typescript
            astro-language-server

            (python313.withPackages (
              ps: with ps; [
                brotli
                fonttools
              ]
            ))
          ];
        };
      }
    );
}
