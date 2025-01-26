import { useEffect, useRef } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { BsExclamationCircle } from 'react-icons/bs';

interface NameInputPopupProps {
  onSubmit: (name: string) => Promise<void>;
  onClose: () => void;
}

const schema = z.object({
  participantName: z.string().trim().min(2).max(20),
});

type FormFields = z.infer<typeof schema>;

export function NameInputPopup({ onSubmit, onClose }: NameInputPopupProps) {
  const t = useTranslations('ViewEditEvent.NameInputPopup');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      participantName: '',
    },
  });

  useEffect(() => {
    setFocus('participantName');
  }, [setFocus]);

  const onSubmitHandler: SubmitHandler<FormFields> = async (data) => {
    try {
      await onSubmit(data.participantName);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center 
        z-50 px-2"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="bg-background p-6 rounded-md max-w-md w-full space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between">
          <label htmlFor="participantName" className="text-xl font-medium">
            {t('title')}
          </label>
          <button onClick={onClose} type="button" disabled={isSubmitting}>
            <RxCross1 size={24} />
          </button>
        </div>
        <div className="flex">
          <p className="text-sm text-gray-600">{t('description')}</p>
        </div>
        <div>
          <input
            type="text"
            id="participantName"
            placeholder={t('placeholder')}
            className="border-primary"
            disabled={isSubmitting}
            {...register('participantName')}
          />
          {errors.participantName && (
            <div className="flex space-x-2 pt-2 text-red-500 items-center">
              <BsExclamationCircle size={20} />
              <p className="text-sm font-semibold">{t('errorMessage')}</p>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="text-white bg-primary px-4 py-2 rounded-md flex-shrink-0 
              hover:bg-primaryHover focus:bg-primaryHover disabled:opacity-50 
              disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {t('submitButton')}
          </button>
        </div>
      </form>
    </div>
  );
}
