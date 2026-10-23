export function FormAlert({ message }: { message?: string }) {
  return (
    <p aria-live="polite" className="text-sm text-red-300 empty:hidden">
      {message}
    </p>
  );
}
