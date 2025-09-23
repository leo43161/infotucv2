// helpers/translateDay.ts
export const translateDay = (dia: string, language: string): string => {
  const translations: Record<string, string> = {
    "Domingo": "Sunday",
    "Domingos": "Sundays",
    "Domingos y Feriados": "Sundays and Holidays",
    "Domingos y feriados (desde Nogalito)": "Sundays and Holidays (from Nogalito)",
    "El Sabado": "Saturday",
    "Lun a Sab": "Mon to Sat",
    "Lun a Vie": "Mon to Fri",
    "Lunes a sabados": "Monday to Saturdays",
    "Lunes a sábados": "Monday to Saturdays",
    "Lunes a Sabados": "Monday to Saturdays",
    "Lunes a Sábados": "Monday to Saturdays",
    "Lunes a viernes": "Monday to Friday",
    "Lunes a Viernes (desde Nogalito)": "Monday to Friday (from Nogalito)",
    "Lunes aviernes": "Monday to Friday",
    "Los feriados": "Holidays",
    "Insertar dia": "Insert day" // opcional, por si lo querés traducir
  };

  // Si existe traducción, devolverla, si no devolver tal cual
  return language === 'en' ? translations[dia] || dia : dia;
};
