declare module 'react-timeago' {
  import * as React from "react";

  declare namespace ReactTimeago {
      type Unit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

      type Suffix = 'ago' | 'from now';

      type Formatter = (
        value: number,
        unit: Unit,
        suffix: Suffix,
        epochMiliseconds: number,
        nextFormatter?: Formatter
      ) => React.ReactNode;

      interface ReactTimeagoProps {
        readonly live?: boolean;
        readonly minPeriod?: number;
        readonly maxPeriod?: number;
        readonly component?: string | React.ComponentType<any>;
        readonly title?: string;
        readonly formatter?: Formatter;
        readonly date: string | number | Date;
        readonly now?: () => number;
      }
  }

  declare const ReactTimeago: React.ComponentClass<ReactTimeago.ReactTimeagoProps>;
  export default ReactTimeago;
}
