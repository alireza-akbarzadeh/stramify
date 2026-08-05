import { cva, type VariantProps } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-200 cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-md hover:opacity-90',
        secondary: 'bg-secondary text-secondary-foreground hover:opacity-90',
        destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',
        outline: 'border border-border bg-transparent text-foreground hover:bg-accent',
        ghost: 'bg-transparent text-foreground hover:bg-accent',
        link: 'bg-transparent text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-11 px-4 py-2 [&_svg]:size-4',
        sm: 'h-9 rounded-sm px-3 [&_svg]:size-4',
        lg: 'h-12 rounded-lg px-6 text-base [&_svg]:size-5',
        icon: 'size-11 [&_svg]:size-5'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
