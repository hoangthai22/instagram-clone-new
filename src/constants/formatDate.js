import { formatRelative } from "date-fns";
import viLocale from "date-fns/locale/vi";
export function formatDate(seconds) {
    let formattedDate = "";
    if (seconds) {
        const currentDate = new Date();
        const dateToFormat = new Date(seconds * 1000);
        formattedDate = formatRelative(dateToFormat, currentDate, { locale: viLocale });
        formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }
    return formattedDate;
}
