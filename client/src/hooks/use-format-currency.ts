import { useTypedSelector } from "@/app/hook";
import { formatCurrency } from "@/lib/format-currency";

export const useFormatCurrency = () => {
    const { currency, showDecimals } = useTypedSelector((state) => state.settings);

    const formatter = (value: number, options: Parameters<typeof formatCurrency>[1] = {}) => {
        return formatCurrency(value, {
            currency,
            decimalPlaces: options.decimalPlaces ?? (showDecimals ? 2 : 0),
            ...options,
        });
    };

    return formatter;
};
