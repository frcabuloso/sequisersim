'use client'

import * as React from 'react'
import { OTPInput, OTPInputContext } from 'input-otp'
import { MinusIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        'flex items-center justify-center gap-1.5 sm:gap-2 has-disabled:opacity-50',
        containerClassName,
      )}
      className={cn('disabled:cursor-not-allowed', className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn('flex items-center gap-1.5 sm:gap-2', className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        'relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center border-2 rounded-lg text-xl sm:text-2xl font-semibold transition-all outline-none',
        'bg-zinc-900 border-zinc-700 text-white',
        'data-[active=true]:border-emerald-500 data-[active=true]:ring-2 data-[active=true]:ring-emerald-500/30 data-[active=true]:bg-zinc-800',
        'aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/30 aria-invalid:bg-red-950/20',
        'hover:border-zinc-600 focus-within:border-emerald-500',
        className,
      )}
      {...props}
    >
      <span className="text-white font-mono select-none">{char || ''}</span>
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-0.5 animate-caret-blink bg-emerald-400" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<'div'>) {
  return (
    <div 
      data-slot="input-otp-separator" 
      role="separator" 
      className="flex items-center justify-center w-6 sm:w-8"
      {...props}
    >
      <MinusIcon className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500" />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
