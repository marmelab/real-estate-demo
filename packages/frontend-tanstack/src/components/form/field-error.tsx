export function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} className="text-sm text-red-300">
      {message}
    </p>
  ) : null;
}
