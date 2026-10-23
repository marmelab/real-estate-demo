import { z } from "zod";

export function configureZodErrors(): void {
  z.config(z.locales.fr());
  z.config({
    customError: (issue) =>
      issue.input === undefined || issue.input === ""
        ? "Champ requis"
        : undefined,
  });
}
