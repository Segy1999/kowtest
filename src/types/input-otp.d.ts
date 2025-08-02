declare module 'input-otp' {
  import * as React from 'react';

  export interface OTPInputProps extends React.HTMLAttributes<HTMLDivElement> {
    maxLength?: number;
    value?: string;
    onChange?: (value: string) => void;
    containerClassName?: string;
    // Add other props as needed
  }

  export interface OTPInputContextType {
    slots: any[];
    // Add other context properties as needed
  }

  export const OTPInput: React.ForwardRefExoticComponent<
    OTPInputProps & React.RefAttributes<HTMLDivElement>
  >;

  export const OTPInputContext: React.Context<OTPInputContextType>;
}
