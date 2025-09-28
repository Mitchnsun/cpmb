"use client";

import { FormEvent, useState } from "react";

import MailIcon from "@/assets/icons/mail.svg";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'adresse e-mail est requise";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Veuillez saisir une adresse e-mail valide";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "L'objet est requis";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Le message est requis";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Le message doit contenir au moins 10 caractères";
    }

    return newErrors;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      // Create mailto link with form data
      const subject = encodeURIComponent(formData.subject);
      const body = encodeURIComponent(
        `Nom: ${formData.name}\nE-mail: ${formData.email}\n\nMessage:\n${formData.message}`
      );
      const mailtoLink = `mailto:bureau@choeurdespaysdumontblanc.fr?subject=${subject}&body=${body}`;

      // Open email client
      window.location.href = mailtoLink;

      // Show success message
      setIsSubmitted(true);

      // Reset form after a delay
      setTimeout(() => {
        setFormData({ name: "", email: "", subject: "", message: "" });
        setIsSubmitted(false);
      }, 3000);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <div className="mb-4 flex items-center justify-center">
          <MailIcon className="h-8 w-8 text-green-600" aria-hidden="true" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-green-800">Message envoyé !</h3>
        <p className="text-green-700">
          Votre client de messagerie s&apos;est ouvert avec votre message. N&apos;oubliez pas de l&apos;envoyer depuis
          votre application de messagerie.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="contact-name" className="mb-1 block text-sm font-medium text-gray-700">
          Nom{" "}
          <span className="text-red-500" aria-label="requis">
            *
          </span>
        </label>
        <input
          type="text"
          id="contact-name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className={`w-full rounded-md border px-3 py-2 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          aria-describedby={errors.name ? "name-error" : undefined}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-email" className="mb-1 block text-sm font-medium text-gray-700">
          Adresse e-mail{" "}
          <span className="text-red-500" aria-label="requis">
            *
          </span>
        </label>
        <input
          type="email"
          id="contact-email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className={`w-full rounded-md border px-3 py-2 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          aria-describedby={errors.email ? "email-error" : undefined}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-subject" className="mb-1 block text-sm font-medium text-gray-700">
          Objet{" "}
          <span className="text-red-500" aria-label="requis">
            *
          </span>
        </label>
        <input
          type="text"
          id="contact-subject"
          value={formData.subject}
          onChange={(e) => handleInputChange("subject", e.target.value)}
          className={`w-full rounded-md border px-3 py-2 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none ${
            errors.subject ? "border-red-500" : "border-gray-300"
          }`}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          aria-invalid={!!errors.subject}
        />
        {errors.subject && (
          <p id="subject-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.subject}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-gray-700">
          Message{" "}
          <span className="text-red-500" aria-label="requis">
            *
          </span>
        </label>
        <textarea
          id="contact-message"
          rows={5}
          value={formData.message}
          onChange={(e) => handleInputChange("message", e.target.value)}
          className={`resize-vertical w-full rounded-md border px-3 py-2 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none ${
            errors.message ? "border-red-500" : "border-gray-300"
          }`}
          aria-describedby={errors.message ? "message-error" : undefined}
          aria-invalid={!!errors.message}
          placeholder="Votre message..."
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-sky-600 px-4 py-2 font-medium text-white transition-colors hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none"
      >
        Envoyer le message
      </button>

      <p className="text-center text-sm text-gray-600">
        <span className="text-red-500">*</span> Champs obligatoires
      </p>
    </form>
  );
};

export default ContactForm;
