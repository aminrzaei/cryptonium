import { useState } from "react";
import HmacSHA256 from "crypto-js/hmac-sha256";
import Base64 from "crypto-js/enc-base64";

import { useClipboard } from "@mantine/hooks";

import {
  Textarea,
  TextInput,
  Radio,
  Text,
  Button,
  Divider,
} from "@mantine/core";
import { CopyIcon, FlameIcon } from "@primer/octicons-react";

const Form = () => {
  const clipboard = useClipboard({ timeout: 2500 });
  const [plain, setPlain] = useState("");
  const [key, setKey] = useState("");
  const [outputType, setOutputType] = useState("base64");
  const [output, setOutput] = useState("");

  const [keyError, setKeyError] = useState("");

  const handleGenerate = () => {
    if (key === "") {
      setKeyError("Key is required!");
      return;
    }
    const encryptedInHexType = HmacSHA256(plain, key);
    if (outputType === "base64") {
      const hexToBase64 = Base64.stringify(encryptedInHexType);
      setOutput(hexToBase64);
      return;
    }
    setOutput(encryptedInHexType);
    return;
  };

  return (
    <>
      <Text size="xl" weight={600} mb="md">
        HMAC-SHA256
      </Text>
      <div className="form">
        <Textarea
          placeholder="Enter your plain text here"
          label="Plain Text or Cipher"
          value={plain}
          onChange={(event) => setPlain(event.currentTarget.value)}
          mb="xs"
        />
        <TextInput
          placeholder="Enter your key"
          label="Key"
          value={key}
          onChange={(event) => {
            setKey(event.currentTarget.value);
            setKeyError("");
          }}
          error={keyError}
          withAsterisk
          mb="xs"
        />
        <Radio.Group
          name="output-format"
          label="Output Text Format"
          spacing="sm"
          withAsterisk
          value={outputType}
          onChange={setOutputType}
          mb="xs"
        >
          <Radio value="base64" label="Base64" />
          <Radio value="hex" label="HEX" />
        </Radio.Group>
        <Divider my="md" variant="dashed" />
        <Textarea
          readOnly
          placeholder="Output will generate here"
          label="Output"
          value={output}
          mb="md"
        />
        <div className="btn-container">
          <Button
            leftIcon={<FlameIcon />}
            color="blue"
            fullWidth
            onClick={handleGenerate}
          >
            Generate
          </Button>
          {output && (
            <Button
              leftIcon={<CopyIcon />}
              variant="light"
              ml="sm"
              fullWidth
              color={clipboard.copied ? "orange" : "teal"}
              onClick={() => clipboard.copy(output)}
            >
              {clipboard.copied ? "Copied" : "Copy output"}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default Form;
