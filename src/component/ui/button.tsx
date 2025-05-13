import type { ComponentProps } from "react"

const Button = ({ children, className, ...props
}: ComponentProps<"button">) => {
  return (
    < button
      className={"select-none flex gap-2 py-2 px-4 bg-blue-500 rounded-sm text-gray-100 cursor-pointer" + (className ? className : "")}
      {...props}
    >
      {children}
    </button >
  )
}

export default Button

