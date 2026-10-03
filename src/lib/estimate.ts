export type EstimateInput = {
  job: string;
  city: string;
  details: string;
  name: string;
};

export function buildEstimateMessage({ job, city, details, name }: EstimateInput) {
  return [
    "Hi A&S Maintenance, I need an estimate.",
    `Job: ${job}`,
    `City: ${city}`,
    `Details: ${details}`,
    `Name: ${name}`,
  ].join("\n");
}
