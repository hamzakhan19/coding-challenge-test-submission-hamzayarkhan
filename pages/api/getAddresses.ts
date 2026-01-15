import type { NextApiRequest, NextApiResponse } from "next";

import generateMockAddresses from "../../src/utils/generateMockAddresses";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { postcode, streetnumber },
  } = req;

  if (!postcode || !streetnumber) {
    return res.status(400).send({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode and street number fields mandatory!",
    });
  }

  if ((postcode as string).length < 4) {
    return res.status(400).send({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode must be at least 4 digits!",
    });
  }

  const isStrictlyNumeric = (value: string) => {
    return /^\d+$/.test(value);
  };

  const validateNumericField = (value: string, errorMessage: string) => {
    if (!isStrictlyNumeric(value)) {
      return res.status(400).send({
        status: "error",
        errormessage: errorMessage,
      });
    }
    return null;
  };

  const postcodeError = validateNumericField(
    postcode as string,
    "Postcode must be all digits and non negative!"
  );
  if (postcodeError) return postcodeError;

  const streetNumberError = validateNumericField(
    streetnumber as string,
    "Street Number must be all digits and non negative!"
  );
  if (streetNumberError) return streetNumberError;

  const mockAddresses = generateMockAddresses(
    postcode as string,
    streetnumber as string
  );

  if (mockAddresses) {
    const timeout = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    await timeout(500);

    return res.status(200).json({
      status: "ok",
      details: mockAddresses,
    });
  }

  return res.status(404).json({
    status: "error",
    // DO NOT MODIFY MSG - used for grading
    errormessage: "No results found!",
  });
}
