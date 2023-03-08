import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  FormControl,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  Link,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import algoliasearch from "algoliasearch";
import React, { useState } from "react";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const client = algoliasearch(
    "97IMN3NK2B",
    "37ceebda0e1214e7e2f764b98670be8c"
  );
  const index = client.initIndex("speech", { clickAnalytics: true });

  const handleSearch = async (event) => {
    const query = event.target.value;
    setSearchTerm(query);

    const { hits } = await index.search(query, {
      attributesToHighlight: ["title", "description"],
      attributesToRetrieve: ["title", "description", "image"],
      highlightPreTag: "<strong style='background-color: yellow;'>",
      highlightPostTag: "</strong>",
    });

    setSearchResults(hits);
  };

  const handleButtonClick = (objectID) => {
    index
      .click(objectID, { userToken: "user-token" })
      .then(() => console.log("click success"))
      .catch((err) => console.log("click error", err));
  };

  return (
    <Container>
      <FormControl variant="standard" fullWidth>
        <InputLabel htmlFor="input-with-icon-adornment"></InputLabel>
        <Input
          id="input-with-icon-adornment"
          placeholder="search Ahmed Subhy mansour videos here ... ابحث هنا عن مقاطع فيديو احمد صبحي منصور "
          value={searchTerm}
          onChange={handleSearch}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
      </FormControl>
      <Grid container>
        {searchResults.map((result) => (
          <Grid item key={result.objectID}>
            <Grid container>
              <Grid item xs={2}>
                <img src={result.image} alt={result.title} width="128" />
                <br />
                <Button
                  variant="contained"
                  onClick={() => handleButtonClick(result.objectID)}
                >
                  Click me
                </Button>
              </Grid>
              <Grid item xs={10}>
                <Link href={result.url}>
                  <Typography
                    align="center"
                    variant="h6"
                    dangerouslySetInnerHTML={{
                      __html: result._highlightResult.title.value,
                    }}
                  ></Typography>
                </Link>

                <Typography
                  variant="body1"
                  dangerouslySetInnerHTML={{
                    __html: result._highlightResult.description.value,
                  }}
                ></Typography>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default App;
