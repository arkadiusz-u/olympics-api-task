export const dateFormatterOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
};

export const timeFormatterOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
};

export const formatDate = (
    date: Date | string | number,
    options?: Intl.DateTimeFormatOptions,
    locale: string = "en-US"
): string => {
    const d = new Date(date)

    if (Number.isNaN(d.getTime())) {
        throw new Error("Invalid date")
    }

    return new Intl.DateTimeFormat(locale, options).format(d)
}