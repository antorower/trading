export const SaveError = async (error, location, statusCode) => {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/errors/create-error`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ error: error, location: location, statusCode: statusCode }),
  });
  return;
};
