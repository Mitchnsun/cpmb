import { type ChangeEvent, type ReactNode } from "react";

import { cn } from "@/utils/classnames";

/** Subject options of a `select` field. */
export interface FieldOption {
  value: string;
  label: string;
}

interface FormFieldProps {
  /** Ties the label to the control; the error gets `<id>-error`. */
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Error message shown under the field, in French. */
  error?: string;
  /** Turns the field into a `select`. */
  options?: readonly FieldOption[];
  /** Shown first in a `select`, so "(obligatoire)" means something. */
  emptyOption?: string;
  /** Turns the field into a `textarea`. */
  rows?: number;
  type?: "text" | "email";
  autoComplete?: string;
}

/**
 * A labelled form field of the charter: the label above the control — never
 * a placeholder standing in for it — the word "(obligatoire)" rather than an
 * asterisk or a colour, and the error message under the field, tied to the
 * control by `aria-describedby`.
 *
 * Every field on the site is required, so the mention is not a prop.
 *
 * The invalid state is carried by `aria-invalid` and by the message itself;
 * the copper edge only repeats it, which is why no colour alone ever says a
 * field is wrong.
 */
const FormField = ({
  id,
  label,
  value,
  onChange,
  error,
  options,
  emptyOption,
  rows,
  type = "text",
  autoComplete,
}: FormFieldProps) => {
  const errorId = `${id}-error`;

  const controlProps = {
    id,
    value,
    "aria-describedby": error ? errorId : undefined,
    "aria-invalid": Boolean(error),
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      onChange(event.target.value),
    className: cn(
      "bg-surface focus:border-teal focus:outline-teal w-full min-h-12 rounded-md border px-3.5 text-lg focus:outline-2",
      error ? "border-copper" : "border-muted"
    ),
  };

  let control: ReactNode;

  if (options) {
    control = (
      <select {...controlProps} required>
        {emptyOption ? <option value="">{emptyOption}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  } else if (rows) {
    control = (
      <textarea {...controlProps} rows={rows} required className={cn(controlProps.className, "resize-y py-3")} />
    );
  } else {
    control = <input {...controlProps} type={type} autoComplete={autoComplete} required />;
  }

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-lg font-semibold">
        {label} <span className="text-muted font-normal">(obligatoire)</span>
      </label>
      {control}
      {error ? (
        <p id={errorId} className="text-copper mt-2 text-lg">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default FormField;
