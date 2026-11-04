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
          version = "2.1.1";
          src = ./.;

          npmDepsHash = "sha256-5h5CHiYIE7uXZn6I48VZoJrfTu+09EsPqAEhWl877as=";

          buildPhase = ''
            npm install
            npm run build -- --sourcemap
            rm -rf ./node_modules
          '';

          installPhase = ''
            mkdir -p $out
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
