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

        pyPkgs = with pkgs; [python313Packages];
      in
      {
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs
            bun
            typescript-language-server
            typescript
            astro-language-server

            (python313.withPackages (ps: with ps; [
              brotli
              fonttools
            ]))
          ];
        };
      }
    );
}
