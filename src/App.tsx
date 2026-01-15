import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";

import useAddressBook from "@/hooks/useAddressBook";
import { useFormFields } from "@/hooks/useFormFields";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";

function App() {
  /**
   * Generic form state (replaces all individual useState + handlers)
   */
  const { values, handleChange, reset, setValues } = useFormFields({
    postCode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
    selectedAddress: "",
  });

  const [error, setError] = React.useState<string | undefined>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);

  const { addAddress } = useAddressBook();

  const handleAddressSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(undefined);
    setAddresses([]);

    if (!values.postCode || !values.houseNumber) {
      setError("Postcode and house number are required");
      return;
    }

    try {
      const response = await fetch(
        `/api/getAddresses?postcode=${values.postCode}&streetnumber=${values.houseNumber}`
      );

      if (!response.ok) {
        const err = await response.json();
        setError(err.errormessage || "Failed to fetch addresses");
        return;
      }

      const data = await response.json();
      setAddresses(
        data.details.map((address: AddressType, index: number) => ({
          ...address,
          id: `${address.postcode}-${address.street}-${index}`,
        }))
      );
    } catch {
      setError("Something went wrong while fetching addresses");
    }
  };

  /**
   * Add personal info submit
   */
  const handlePersonSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!values.selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }

    const foundAddress = addresses.find(
      (address) => address.id === values.selectedAddress
    );

    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    if (!values.firstName || !values.lastName) {
      setError("First name and last name fields mandatory!");
      return;
    }

    addAddress({
      ...foundAddress,
      firstName: values.firstName,
      lastName: values.lastName,
    });
  };

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>

        {/* Find address */}
        <form onSubmit={handleAddressSubmit}>
          <fieldset>
            <legend>🏠 Find an address</legend>

            <div className={styles.formRow}>
              <InputText
                name="postCode"
                placeholder="Post Code"
                value={values.postCode}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formRow}>
              <InputText
                name="houseNumber"
                placeholder="House number"
                value={values.houseNumber}
                onChange={handleChange}
              />
            </div>

            <Button type="submit">Find</Button>
          </fieldset>
        </form>

        {/* Address selection */}
        {addresses.length > 0 &&
          addresses.map((address) => (
            <Radio
              key={address.id}
              name="selectedAddress"
              id={address.id}
              checked={values.selectedAddress === address.id}
              onChange={handleChange}
            >
              <Address {...address} />
            </Radio>
          ))}

        {/* Add personal info */}
        {values.selectedAddress && (
          <form onSubmit={handlePersonSubmit}>
            <fieldset>
              <legend>✏️ Add personal info to address</legend>

              <div className={styles.formRow}>
                <InputText
                  name="firstName"
                  placeholder="First name"
                  value={values.firstName}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formRow}>
                <InputText
                  name="lastName"
                  placeholder="Last name"
                  value={values.lastName}
                  onChange={handleChange}
                />
              </div>

              <Button type="submit">Add to addressbook</Button>
            </fieldset>
          </form>
        )}

        {/* Error */}
        {error && <div className="error">{error}</div>}

        {/* Clear all */}
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            reset();
            setAddresses([]);
            setError(undefined);
          }}
        >
          Clear all fields
        </Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
