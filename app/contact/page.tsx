'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { contactApi } from '@/lib/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await contactApi.send();
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      console.error('Contact form error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (isSuccess) {
    return (
      <div className="bg-gray-300 dark:bg-gray-900 min-h-screen py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2/3 h-48 bg-gray-400 dark:bg-gray-800 rounded-bl-[100%]"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-64 bg-white dark:bg-gray-950 rounded-tr-[80%]"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-white/30 dark:bg-gray-800/30 rounded-full"></div>
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 relative z-10">
          <Card className="text-center">
            <CardContent className="pt-12 pb-12">
              <div className="inline-flex p-4 rounded-full bg-green-100 dark:bg-green-900 mb-6">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Message envoyé avec succès!
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                Merci de m&apos;avoir contacté. Je vous répondrai dans les plus brefs délais.
              </p>
              <Button onClick={() => setIsSuccess(false)}>
                Envoyer un autre message
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-300 dark:bg-gray-900 min-h-screen py-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-2/3 h-48 bg-gray-400 dark:bg-gray-800 rounded-bl-[100%]"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-64 bg-white dark:bg-gray-950 rounded-tr-[80%]"></div>
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-white/30 dark:bg-gray-800/30 rounded-full"></div>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex p-4 rounded-full bg-white dark:bg-gray-800 mb-4">
            <Mail className="h-12 w-12 text-gray-900 dark:text-gray-100" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Contactez-moi</h1>
          <p className="text-xl text-gray-800 dark:text-gray-200 max-w-2xl mx-auto">
            Une question, un projet ou simplement envie d&apos;échanger ? N&apos;hésitez pas à me contacter.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Envoyer un message</CardTitle>
            <CardDescription>
              Remplissez le formulaire ci-dessous et je vous répondrai rapidement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Votre nom"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Sujet *</Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="L'objet de votre message"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Écrivez votre message ici..."
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="text-center pt-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  Pour envoyer des messages, connectez votre API Laravel au endpoint{' '}
                  <code className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-2 py-1 rounded text-xs">
                    POST /api/contact
                  </code>
                </p>
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    'Envoi en cours...'
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Autres moyens de me contacter
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Vous pouvez également me retrouver sur les réseaux sociaux ou m&apos;envoyer un email
                directement à{' '}
                <a href="mailto:contact@example.com" className="text-slate-900 dark:text-slate-100 hover:underline font-medium">
                  contact@example.com
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
