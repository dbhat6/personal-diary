import * as React from "react";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Button, Paper, TextField } from "@mui/material";

const Home: NextPage = () => {
  const [headingValue, setHeadingValue] = React.useState<string>("");
  const [textValue, setTextValue] = React.useState<string>("");
  const [tagValue, setTagValue] = React.useState<string>("");

  const onHeadingChange = (e: any) => setHeadingValue(e.target.value);
  const onTextChange = (e: any) => setTextValue(e.target.value);
  const onTagChange = (e: any) => {
    console.log(e.target.value);
    setTagValue(e.target.value);
  };
  const handleSubmit = async () => {
    console.log({ textValue, headingValue, tagValue });
    const res = await fetch("/api/notes", {
      body: JSON.stringify({ body: textValue, heading: headingValue, tags: tagValue.split(" ") }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    console.log(res);
    handleReset();
  };
  const handleReset = () => {
    setHeadingValue("");
    setTextValue("");
    setTagValue("");
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 20,
          display: "inherit",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper>
          <Typography variant="h4" gutterBottom component="div" textAlign="center">
            Create Card
          </Typography>

          <TextField
            onChange={onHeadingChange}
            value={headingValue}
            maxRows={2}
            label={"Heading Value"}
            sx={{
              my: 2,
              display: "flex",
            }}
          />

          <TextField
            onChange={onTextChange}
            value={textValue}
            multiline
            maxRows={10}
            label={"Body Value"}
            sx={{
              my: 2,
              display: "flex",
            }}
          />

          <TextField
            onChange={onTagChange}
            value={tagValue}
            maxRows={2}
            label={"Tag Value - Separated by space"}
            sx={{
              my: 2,
              display: "flex",
            }}
          />

          <Button onClick={handleSubmit}>Submit</Button>
          <Button onClick={handleReset}>Reset</Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home;
