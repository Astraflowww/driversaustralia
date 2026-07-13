import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function formatDate(dateInput: Date | string | number): string {
  const date = new Date(dateInput)
  if (isNaN(date.getTime())) return ''
  const day = date.getDate()
  const month = MONTHS[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

export function formatShortDate(dateInput: Date | string | number): string {
  const date = new Date(dateInput)
  if (isNaN(date.getTime())) return ''
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export function formatChatDate(dateInput: Date | string | number): string {
  const date = new Date(dateInput)
  if (isNaN(date.getTime())) return ''
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`
}

export function formatMonthDay(dateInput: Date | string | number): string {
  const date = new Date(dateInput)
  if (isNaN(date.getTime())) return ''
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`
}

