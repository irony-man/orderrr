import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import DesignCards from "../../common/DesignCards";
import apis from "../../../redux/actions/apis";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const DesignsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useSelector((state) => state.user);
  const [query, setQuery] = useState({
    search: searchParams.get("search") || "",
    design_type: searchParams.get("design_type") || "",
    ordering: searchParams.get("ordering") || "",
  });

  const [search, setSearch] = useState(query.search);


  useEffect(() => {
    const handler = setTimeout(() => {
      handleChange("search", search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const handleChange = (key, value) => {
    searchParams.set(key, value);
    setQuery({ ...query, [key]: value });
    setSearchParams(searchParams);
  };

  return (
    <div className="container">
      <title>Designs - Orderrr</title>
      <Box
        sx={{
          "& .MuiInputBase-root": { bgcolor: "background.paper" },
        }}
        className="row gy-4 mb-5"
      >
        <div className="col-lg-4 col-12">
          <TextField
            label="Search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            fullWidth
          />
        </div>
        <div className="col-lg-4 col-12">
          <FormControl fullWidth size="small">
            <InputLabel htmlFor="type">Design Type</InputLabel>
            <Select
              id="type"
              label="Design Type"
              color="primary"
              value={query.design_type}
              onChange={(e) => handleChange("design_type", e.target.value)}
            >
              <MenuItem selected value="">
                <em>All</em>
              </MenuItem>
              {user.choices?.design_type.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="col-lg-4 col-12">
          <FormControl fullWidth size="small">
            <InputLabel htmlFor="sort">Sort By</InputLabel>
            <Select
              id="sort"
              label="Sort By"
              color="primary"
              value={query.ordering}
              onChange={(e) => handleChange("ordering", e.target.value)}
            >
              <MenuItem selected value="">
                <em>None</em>
              </MenuItem>
              {user.choices?.design_ordering_type.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </Box>
      <DesignCards
        key={query.search + query.design_type + query.ordering}
        query={query}
        fetchFunc={apis.listDesign}
      />
    </div>
  );
};

export default DesignsPage;
