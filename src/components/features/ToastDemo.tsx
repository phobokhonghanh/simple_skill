'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { useToast } from '@/components/providers/ToastProvider';
import { Button } from '@/components/ui/button';

export function ToastDemo() {
  const t = useTranslations('common');
  const { success, error, warning, info, custom } = useToast();

  return (
    <div className="flex flex-col gap-4 p-5 border rounded-2xl bg-card text-card-foreground shadow-lg max-w-full">
      <div className="space-y-1">
        <h3 className="text-lg font-bold tracking-tight text-foreground">
          {t('toast_demo_title')}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {t('toast_demo_desc')}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        <Button
          id="btn-toast-success"
          onClick={() => success(t('toast_success_msg'))}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold h-10 px-4 cursor-pointer"
        >
          {t('toast_success_btn')}
        </Button>

        <Button
          id="btn-toast-error"
          onClick={() => error(t('toast_error_msg'))}
          className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-semibold h-10 px-4 cursor-pointer"
        >
          {t('toast_error_btn')}
        </Button>

        <Button
          id="btn-toast-warning"
          onClick={() => warning(t('toast_warning_msg'))}
          className="bg-amber-500 hover:bg-amber-600 text-black rounded-xl text-xs sm:text-sm font-semibold h-10 px-4 cursor-pointer"
        >
          {t('toast_warning_btn')}
        </Button>

        <Button
          id="btn-toast-info"
          onClick={() => info(t('toast_info_msg'))}
          className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs sm:text-sm font-semibold h-10 px-4 cursor-pointer"
        >
          {t('toast_info_btn')}
        </Button>

        <Button
          id="btn-toast-custom"
          onClick={() =>
            custom(t('toast_custom_msg'), {
              bgClass: 'bg-orange-500/5 dark:bg-orange-500/10 backdrop-blur-md',
              textClass: 'text-orange-600 dark:text-orange-400 font-semibold',
              borderClass: 'border-orange-500/20 dark:border-orange-500/30',
              progressClass: 'bg-orange-500',
            })
          }
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs sm:text-sm font-semibold h-10 px-4 cursor-pointer"
        >
          {t('toast_custom_btn')}
        </Button>
      </div>
    </div>
  );
}
