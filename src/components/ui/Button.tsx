import clsx from 'clsx'
import type { ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { buttonClasses, type ButtonSize, type ButtonVariant } from './buttonStyles'

interface StyleProps {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({
  variant,
  size,
  className,
  type = 'button',
  ...rest
}: StyleProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={clsx(buttonClasses(variant, size), className)} {...rest} />
}

export function ButtonLink({ variant, size, className, ...rest }: StyleProps & LinkProps) {
  return <Link className={clsx(buttonClasses(variant, size), className)} {...rest} />
}
