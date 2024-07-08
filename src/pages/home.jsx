import { Add, Info, CheckCircle, Warning, Error, Mail, ShoppingCartOutlined, KeyboardTabOutlined, HomeOutlined, ArrowBack, ArrowForward, KeyboardArrowDown, PanoramaFishEye } from "@mui/icons-material";
import { Button, Container, Box, Stack, Typography, Grid, Alert, ButtonBase, Badge, Chip, Avatar, Breadcrumbs, useTheme, Tabs, Tab, Pagination, PaginationItem, TextField, FormLabel, FormControl, RadioGroup, FormControlLabel, Radio, Checkbox, Select, MenuItem } from "@mui/material";
import { Paragraph, Span } from "components/typography";
import HomeIcon from "@mui/icons-material/Home";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import CheckBoxIcon from "icons/CheckBoxIcon";
import BlankCheckBoxIcon from "icons/BlankCheckBoxIcon";
import { COUNTRIES } from "__fakeData__/countries";
import { Counter } from "components/counter";
const Home = () => {
  const {
    palette
  } = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [country, setCountry] = useState(COUNTRIES[0].value);
  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };
  return <Container>
      {/* BUTTON VARIANTS */}
      <Box>
        <Box mt={4} bgcolor="white" p={3} borderRadius={4}>
          <Typography fontWeight={600} fontSize={16} mb={2}>
            Default Buttons
          </Typography>

          <Stack direction="row" flexWrap="wrap" gap={3}>
            <Button variant="contained" color="primary">
              Primary
            </Button>
            <Button variant="contained" color="secondary">
              Secondary
            </Button>
            <Button variant="contained" color="warning">
              Warning
            </Button>
            <Button variant="contained" color="error">
              Error
            </Button>
            <Button variant="contained" color="success">
              Success
            </Button>
          </Stack>
        </Box>

        <Box mt={4} bgcolor="white" p={3} borderRadius={4}>
          <Typography fontWeight={600} fontSize={16} mb={2}>
            Outline Buttons
          </Typography>

          <Stack direction="row" flexWrap="wrap" gap={3}>
            <Button variant="outlined" color="primary">
              Primary
            </Button>
            <Button variant="outlined" color="secondary">
              Secondary
            </Button>
            <Button variant="outlined" color="warning">
              Warning
            </Button>
            <Button variant="outlined" color="error">
              Error
            </Button>
            <Button variant="outlined" color="success">
              Success
            </Button>
          </Stack>
        </Box>

        <Box mt={4} bgcolor="white" p={3} borderRadius={4}>
          <Typography fontWeight={600} fontSize={16} mb={2}>
            Left Icon with Text
          </Typography>

          <Stack direction="row" flexWrap="wrap" gap={3}>
            <Button color="primary" startIcon={<Add />}>
              Primary
            </Button>
            <Button color="secondary" startIcon={<Add />}>
              Secondary
            </Button>
            <Button color="warning" startIcon={<Add />}>
              Warning
            </Button>
            <Button color="error" startIcon={<Add />}>
              Error
            </Button>
            <Button color="success" startIcon={<Add />}>
              Success
            </Button>
          </Stack>
        </Box>

        <Box my={4} bgcolor="white" p={3} borderRadius={4}>
          <Typography fontWeight={600} fontSize={16} mb={2}>
            Left Icon with Text
          </Typography>

          <Stack direction="row" flexWrap="wrap" gap={3}>
            <Button color="primary" endIcon={<Add />}>
              Primary
            </Button>
            <Button color="secondary" endIcon={<Add />}>
              Secondary
            </Button>
            <Button color="warning" endIcon={<Add />}>
              Warning
            </Button>
            <Button color="error" endIcon={<Add />}>
              Error
            </Button>
            <Button color="success" endIcon={<Add />}>
              Success
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* ALERT VARIANTS */}
      <Grid container spacing={3}>
        <Grid item lg={6} xs={12}>
          <Box bgcolor="white" p={3} borderRadius={4}>
            <Typography fontWeight={600} fontSize={16} mb={2}>
              Standard Alerts
            </Typography>

            <Stack spacing={3}>
              <Alert severity="info" onClose={() => {}} icon={<Info />}>
                This is an primary alert — check it out!
              </Alert>
              <Alert severity="success" onClose={() => {}} icon={<CheckCircle />}>
                This is a success alert — check it out!
              </Alert>
              <Alert severity="warning" onClose={() => {}} icon={<Warning />}>
                This is a warning alert — check it out!
              </Alert>
              <Alert severity="error" onClose={() => {}} icon={<Error />}>
                This is an error alert — check it out!
              </Alert>
            </Stack>
          </Box>
        </Grid>

        <Grid item lg={6} xs={12}>
          <Box bgcolor="white" p={3} borderRadius={4}>
            <Paragraph fontWeight={600} fontSize={16} mb={2}>
              Action Standard Alerts
            </Paragraph>

            <Stack spacing={3}>
              <Alert severity="info" icon={<Info />} action={<Stack className="btn-group" direction="row">
                    <ButtonBase>UNDO</ButtonBase>
                    <ButtonBase>Action</ButtonBase>
                  </Stack>}>
                This is an primary alert — check it out!
              </Alert>

              <Alert severity="success" icon={<CheckCircle />} action={<Stack className="btn-group" direction="row">
                    <ButtonBase>UNDO</ButtonBase>
                    <ButtonBase>Action</ButtonBase>
                  </Stack>}>
                This is a success alert — check it out!
              </Alert>

              <Alert severity="warning" icon={<Warning />} action={<Stack className="btn-group" direction="row">
                    <ButtonBase>UNDO</ButtonBase>
                    <ButtonBase>Action</ButtonBase>
                  </Stack>}>
                This is a warning alert — check it out!
              </Alert>

              <Alert severity="error" icon={<Error />} action={<Stack className="btn-group" direction="row">
                    <ButtonBase>UNDO</ButtonBase>
                    <ButtonBase>Action</ButtonBase>
                  </Stack>}>
                This is an error alert — check it out!
              </Alert>
            </Stack>
          </Box>
        </Grid>

        <Grid item lg={6} xs={12}>
          <Box bgcolor="white" p={3} borderRadius={4}>
            <Paragraph fontWeight={600} fontSize={16} mb={2}>
              Outline Alerts
            </Paragraph>

            <Stack spacing={3}>
              <Alert severity="info" variant="outlined" onClose={() => {}} icon={<Info />}>
                This is an primary alert — check it out!
              </Alert>
              <Alert severity="success" variant="outlined" onClose={() => {}} icon={<CheckCircle />}>
                This is a success alert — check it out!
              </Alert>
              <Alert severity="warning" variant="outlined" onClose={() => {}} icon={<Warning />}>
                This is a warning alert — check it out!
              </Alert>
              <Alert severity="error" variant="outlined" onClose={() => {}} icon={<Error />}>
                This is an error alert — check it out!
              </Alert>
            </Stack>
          </Box>
        </Grid>

        <Grid item lg={6} xs={12}>
          <Box bgcolor="white" p={3} borderRadius={4}>
            <Paragraph fontWeight={600} fontSize={16} mb={2}>
              Action Outlined Alerts
            </Paragraph>

            <Stack spacing={3}>
              <Alert severity="info" variant="outlined" icon={<Info />} action={<Stack className="btn-group" direction="row">
                    <ButtonBase>UNDO</ButtonBase>
                    <ButtonBase>Action</ButtonBase>
                  </Stack>}>
                This is an primary alert — check it out!
              </Alert>

              <Alert severity="success" variant="outlined" icon={<CheckCircle />} action={<Stack className="btn-group" direction="row">
                    <ButtonBase>UNDO</ButtonBase>
                    <ButtonBase>Action</ButtonBase>
                  </Stack>}>
                This is a success alert — check it out!
              </Alert>

              <Alert severity="warning" variant="outlined" icon={<Warning />} action={<Stack className="btn-group" direction="row">
                    <ButtonBase>UNDO</ButtonBase>
                    <ButtonBase>Action</ButtonBase>
                  </Stack>}>
                This is a warning alert — check it out!
              </Alert>

              <Alert severity="error" variant="outlined" icon={<Error />} action={<Stack className="btn-group" direction="row">
                    <ButtonBase>UNDO</ButtonBase>
                    <ButtonBase>Action</ButtonBase>
                  </Stack>}>
                This is an error alert — check it out!
              </Alert>
            </Stack>
          </Box>
        </Grid>

        <Grid item lg={6} xs={12}>
          <Box bgcolor="white" p={3} borderRadius={4}>
            <Paragraph fontWeight={600} fontSize={16} mb={2}>
              Filled Alerts
            </Paragraph>

            <Stack spacing={3}>
              <Alert severity="info" variant="filled" onClose={() => {}} icon={<Info />}>
                This is an primary alert — check it out!
              </Alert>
              <Alert severity="success" variant="filled" onClose={() => {}} icon={<CheckCircle />}>
                This is a success alert — check it out!
              </Alert>
              <Alert severity="warning" variant="filled" onClose={() => {}} icon={<Warning />}>
                This is a warning alert — check it out!
              </Alert>
              <Alert severity="error" variant="filled" onClose={() => {}} icon={<Error />}>
                This is an error alert — check it out!
              </Alert>
            </Stack>
          </Box>
        </Grid>

        <Grid item lg={6} xs={12}>
          <Box bgcolor="white" p={3} borderRadius={4}>
            <Paragraph fontWeight={600} fontSize={16} mb={2}>
              Action Filled Alerts
            </Paragraph>

            <Stack spacing={3}>
              <Alert severity="info" variant="filled" icon={<Info />} action={<Stack className="btn-group" direction="row">
                    <ButtonBase>UNDO</ButtonBase>
                    <ButtonBase>Action</ButtonBase>
                  </Stack>}>
                This is an primary alert — check it out!
              </Alert>

              <Alert severity="success" variant="filled" icon={<CheckCircle />} action={<Stack className="btn-group" direction="row">
                    <ButtonBase>UNDO</ButtonBase>
                    <ButtonBase>Action</ButtonBase>
                  </Stack>}>
                This is a success alert — check it out!
              </Alert>

              <Alert severity="warning" variant="filled" icon={<Warning />} action={<Stack className="btn-group" direction="row">
                    <ButtonBase>UNDO</ButtonBase>
                    <ButtonBase>Action</ButtonBase>
                  </Stack>}>
                This is a warning alert — check it out!
              </Alert>

              <Alert severity="error" variant="filled" icon={<Error />} action={<Stack className="btn-group" direction="row">
                    <ButtonBase>UNDO</ButtonBase>
                    <ButtonBase>Action</ButtonBase>
                  </Stack>}>
                This is an error alert — check it out!
              </Alert>
            </Stack>
          </Box>
        </Grid>
      </Grid>

      {/* BADGE VARIANTS */}
      <Box>
        <Box mt={4} bgcolor="white" p={3} borderRadius={4}>
          <Typography fontWeight={600} fontSize={16} mb={3}>
            Default Badges
          </Typography>

          <Stack direction="row" flexWrap="wrap" gap={3}>
            <Badge badgeContent={4} color="primary">
              <Mail fontSize="large" sx={{
              color: "grey.400"
            }} />
            </Badge>

            <Badge badgeContent={4} color="secondary">
              <Mail fontSize="large" sx={{
              color: "grey.400"
            }} />
            </Badge>

            <Badge badgeContent={4} color="success">
              <Mail fontSize="large" sx={{
              color: "grey.400"
            }} />
            </Badge>

            <Badge badgeContent={4} color="warning">
              <Mail fontSize="large" sx={{
              color: "grey.400"
            }} />
            </Badge>

            <Badge badgeContent={4} color="error">
              <Mail fontSize="large" sx={{
              color: "grey.400"
            }} />
            </Badge>
          </Stack>
        </Box>

        <Box mt={4} bgcolor="white" p={3} borderRadius={4}>
          <Typography fontWeight={600} fontSize={16} mb={3}>
            Dot Badges
          </Typography>

          <Stack direction="row" flexWrap="wrap" gap={3}>
            <Badge color="primary" variant="dot" overlap="circular">
              <Mail fontSize="large" sx={{
              color: "grey.400"
            }} />
            </Badge>

            <Badge color="secondary" variant="dot" overlap="circular">
              <Mail fontSize="large" sx={{
              color: "grey.400"
            }} />
            </Badge>

            <Badge color="success" variant="dot" overlap="circular">
              <Mail fontSize="large" sx={{
              color: "grey.400"
            }} />
            </Badge>

            <Badge color="warning" variant="dot" overlap="circular">
              <Mail fontSize="large" sx={{
              color: "grey.400"
            }} />
            </Badge>

            <Badge color="error" variant="dot" overlap="circular">
              <Mail fontSize="large" sx={{
              color: "grey.400"
            }} />
            </Badge>
          </Stack>
        </Box>
      </Box>

      {/* CHIP VARIANTS */}
      <Box>
        <Box mt={4} bgcolor="white" p={3} borderRadius={4}>
          <Typography fontWeight={600} fontSize={16} mb={3}>
            Default Chips
          </Typography>

          <Stack direction="row" flexWrap="wrap" gap={3}>
            <Chip label="Primary" color="primary" />
            <Chip label="Secondary" color="secondary" />
            <Chip label="Success" color="success" />
            <Chip label="Warning" color="warning" />
            <Chip label="Error" color="error" />
          </Stack>
        </Box>

        <Box mt={4} bgcolor="white" p={3} borderRadius={4}>
          <Typography fontWeight={600} fontSize={16} mb={3}>
            Outlined Chips
          </Typography>

          <Stack direction="row" flexWrap="wrap" gap={3}>
            <Chip variant="outlined" label="Primary" color="primary" />
            <Chip variant="outlined" label="Secondary" color="secondary" />
            <Chip variant="outlined" label="Success" color="success" />
            <Chip variant="outlined" label="Warning" color="warning" />
            <Chip variant="outlined" label="Error" color="error" />
          </Stack>
        </Box>

        <Box mt={4} bgcolor="white" p={3} borderRadius={4}>
          <Typography fontWeight={600} fontSize={16} mb={3}>
            Avatar Filled Chips
          </Typography>

          <Stack direction="row" flexWrap="wrap" gap={3}>
            <Chip label="Primary" color="primary" avatar={<Avatar alt="Natacha" src="/images/users/user-1.png" />} />

            <Chip label="Secondary" color="secondary" avatar={<Avatar alt="Natacha" src="/images/users/user-1.png" />} />

            <Chip label="Success" color="success" avatar={<Avatar alt="Natacha" src="/images/users/user-1.png" />} />

            <Chip label="Warning" color="warning" avatar={<Avatar alt="Natacha" src="/images/users/user-1.png" />} />
            <Chip label="Error" color="error" avatar={<Avatar alt="Natacha" src="/images/users/user-1.png" />} />
          </Stack>
        </Box>

        <Box mt={4} bgcolor="white" p={3} borderRadius={4}>
          <Typography fontWeight={600} fontSize={16} mb={3}>
            Avatar Outlined Chips
          </Typography>

          <Stack direction="row" flexWrap="wrap" gap={3}>
            <Chip label="Primary" color="primary" variant="outlined" avatar={<Avatar alt="Natacha" src="/images/users/user-1.png" />} />

            <Chip label="Secondary" color="secondary" variant="outlined" avatar={<Avatar alt="Natacha" src="/images/users/user-1.png" />} />

            <Chip label="Success" color="success" variant="outlined" avatar={<Avatar alt="Natacha" src="/images/users/user-1.png" />} />

            <Chip label="Warning" color="warning" variant="outlined" avatar={<Avatar alt="Natacha" src="/images/users/user-1.png" />} />
            <Chip label="Error" color="error" variant="outlined" avatar={<Avatar alt="Natacha" src="/images/users/user-1.png" />} />
          </Stack>
        </Box>
      </Box>

      {/* ACCORDION VARIANTS */}
      {/* <Box>
        <Box mt={4} bgcolor="white" p={3} borderRadius={4}>
          <Typography fontWeight={600} fontSize={16} mb={3}>
            Default Accordion
          </Typography>
           <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>What admin theme does?</AccordionSummary>
             <AccordionDetails>
              By Uko to save tons and more to time money projects are listed and outstanding.
            </AccordionDetails>
          </Accordion>
           <Accordion expanded>
            <AccordionSummary expandIcon={<ExpandMore />}>What admin theme does?</AccordionSummary>
             <AccordionDetails>
              By Uko to save tons and more to time money projects are listed and outstanding.
            </AccordionDetails>
          </Accordion>
        </Box>
         <Box mt={4} bgcolor="white" p={3} borderRadius={4}>
          <Typography fontWeight={600} fontSize={16} mb={3}>
            Colored Outline Accordion
          </Typography>
           <Accordion className="colored-outline" expanded>
            <AccordionSummary expandIcon={<ExpandMore />}>What admin theme does?</AccordionSummary>
             <AccordionDetails>
              The vows and named is he seven his origin myself any is decision-making. The interface
              of Jeni’s is simple and clean, with the section includes questions that are very
              specific to their customer group. First thing first, you need to sort out what
              explicit. The advice is to see mails and phone call data, then make a rundown of the
              top questions that show up continually.
            </AccordionDetails>
          </Accordion>
           <Accordion className="colored-outline">
            <AccordionSummary expandIcon={<ExpandMore />}>What admin theme does?</AccordionSummary>
             <AccordionDetails>
              The vows and named is he seven his origin myself any is decision-making. The interface
              of Jeni’s is simple and clean, with the section includes questions that are very
              specific to their customer group. First thing first, you need to sort out what
              explicit. The advice is to see mails and phone call data, then make a rundown of the
              top questions that show up continually.
            </AccordionDetails>
          </Accordion>
        </Box>
       </Box> */}

      {/* BREADCRUMB VARIANTS */}
      <Box>
        <Box mt={4} bgcolor="white" p={3} borderRadius={4}>
          <Typography fontWeight={600} fontSize={16} mb={3}>
            Basic Breadcrumb
          </Typography>

          <Breadcrumbs>
            <Paragraph color="inherit">Home</Paragraph>
            <Paragraph color="inherit">Product Page</Paragraph>
            <Paragraph color="grey.400">Active</Paragraph>
          </Breadcrumbs>
        </Box>

        <Box mt={4} bgcolor="white" p={3} borderRadius={4}>
          <Typography fontWeight={600} fontSize={16} mb={3}>
            Dot Breadcrumb
          </Typography>

          <Breadcrumbs aria-label="breadcrumb" separator={<Box className="dot" />}>
            <Paragraph color="inherit">Home</Paragraph>
            <Paragraph color="inherit">Product Page</Paragraph>
            <Paragraph color="grey.400">Active</Paragraph>
          </Breadcrumbs>
        </Box>

        <Box mt={4} bgcolor="white" p={3} borderRadius={4}>
          <Typography fontWeight={600} fontSize={16} mb={3}>
            Text with Icon Breadcrumb
          </Typography>

          <Breadcrumbs aria-label="breadcrumb">
            <NavLink to="/" style={{
            display: "flex",
            alignItems: "center",
            color: "inherit"
          }}>
              <HomeIcon sx={{
              mr: 0.5
            }} fontSize="inherit" />
              Home
            </NavLink>

            <NavLink to="/" style={{
            display: "flex",
            alignItems: "center",
            color: "inherit"
          }}>
              <ShoppingCartOutlined fontSize="inherit" sx={{
              mr: 0.5
            }} />
              Product Page
            </NavLink>

            <NavLink to="/" style={{
            display: "flex",
            alignItems: "center",
            color: palette.grey[400]
          }}>
              <KeyboardTabOutlined fontSize="inherit" sx={{
              mr: 0.5
            }} />
              Active
            </NavLink>
          </Breadcrumbs>

          <Breadcrumbs aria-label="breadcrumb" separator={<Box className="dot" />} sx={{
          my: 2
        }}>
            <NavLink to="/" style={{
            display: "flex",
            alignItems: "center",
            color: "inherit"
          }}>
              <HomeIcon sx={{
              mr: 0.5
            }} fontSize="inherit" />
              Home
            </NavLink>

            <NavLink to="/" style={{
            display: "flex",
            alignItems: "center",
            color: "inherit"
          }}>
              <ShoppingCartOutlined fontSize="inherit" sx={{
              mr: 0.5
            }} />
              Product Page
            </NavLink>

            <NavLink to="/" style={{
            display: "flex",
            alignItems: "center",
            color: palette.grey[400]
          }}>
              <KeyboardTabOutlined fontSize="inherit" sx={{
              mr: 0.5
            }} />
              Active
            </NavLink>
          </Breadcrumbs>

          <Breadcrumbs aria-label="breadcrumb" separator="-">
            <NavLink to="/" style={{
            display: "flex",
            alignItems: "center",
            color: "inherit"
          }}>
              <HomeIcon sx={{
              mr: 0.5
            }} fontSize="inherit" />
              Home
            </NavLink>

            <NavLink to="/" style={{
            display: "flex",
            alignItems: "center",
            color: "inherit"
          }}>
              <ShoppingCartOutlined fontSize="inherit" sx={{
              mr: 0.5
            }} />
              Product Page
            </NavLink>

            <NavLink to="/" style={{
            display: "flex",
            alignItems: "center",
            color: palette.grey[400]
          }}>
              <KeyboardTabOutlined fontSize="inherit" sx={{
              mr: 0.5
            }} />
              Active
            </NavLink>
          </Breadcrumbs>
        </Box>
      </Box>

      {/* TAB VARIANTS */}
      <Box>
        <Box mt={4} bgcolor="white" p={3} borderRadius={4}>
          <Typography fontWeight={600} fontSize={16} mb={3}>
            Normal Tabs
          </Typography>

          <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" allowScrollButtonsMobile>
            <Tab label="Overview" />
            <Tab label="Projects" />
            <Tab label="Campaigns" />
            <Tab label="Documents" />
            <Tab label="Connections" />
            <Tab label="Activity" />
          </Tabs>
        </Box>

        <Box mt={4} bgcolor="white" p={3} borderRadius={4}>
          <Typography fontWeight={600} fontSize={16} mb={3}>
            Left Icon & Text Tabs
          </Typography>

          <Tabs value={tabValue} variant="scrollable" allowScrollButtonsMobile onChange={handleTabChange}>
            <Tab icon={<HomeOutlined />} label="Overview" />
            <Tab icon={<HomeOutlined />} label="Projects" />
            <Tab icon={<HomeOutlined />} label="Campaigns" />
            <Tab icon={<HomeOutlined />} label="Documents" />
            <Tab icon={<HomeOutlined />} label="Connections" />
            <Tab icon={<HomeOutlined />} label="Activity" />
          </Tabs>
        </Box>
      </Box>

      {/* PAGINATION VARIANTS */}
      <Box mb={4}>
        <Box mt={4} bgcolor="white" p={3} borderRadius={4}>
          <Typography fontWeight={600} fontSize={16} mb={3}>
            Basic Pagination
          </Typography>

          <Pagination count={4} sx={{
          mb: 3
        }} />
          <Pagination count={4} shape="rounded" />
        </Box>

        <Box mt={4} bgcolor="white" p={3} borderRadius={4}>
          <Typography fontWeight={600} fontSize={16} mb={3}>
            Offset Pagination
          </Typography>

          <Pagination count={14} sx={{
          mb: 3
        }} />
          <Pagination count={14} shape="rounded" />
        </Box>

        <Box mt={4} bgcolor="white" p={3} borderRadius={4}>
          <Typography fontWeight={600} fontSize={16} mb={3}>
            Arrow Pagination
          </Typography>

          <Pagination count={14} renderItem={item => <PaginationItem slots={{
          previous: ArrowBack,
          next: ArrowForward
        }} {...item} />} sx={{
          mb: 3
        }} />

          <Pagination count={14} shape="rounded" renderItem={item => <PaginationItem slots={{
          previous: ArrowBack,
          next: ArrowForward
        }} {...item} />} />
        </Box>

        <Box mt={4} bgcolor="white" p={3} borderRadius={4}>
          <Typography fontWeight={600} fontSize={16} mb={3}>
            Text arrow Pagination
          </Typography>

          <Pagination count={14} sx={{
          mb: 3
        }} renderItem={item => <PaginationItem className="arrow-text" slots={{
          previous: props => <Stack direction="row" alignItems="center" spacing={0.5} {...props}>
                      <ArrowBack fontSize="small" />
                      <Span lineHeight={1} fontSize={14}>
                        Previous
                      </Span>
                    </Stack>,
          next: props => <Stack direction="row" alignItems="center" spacing={0.5} {...props}>
                      <Span lineHeight={1} fontSize={14}>
                        Next
                      </Span>
                      <ArrowForward fontSize="small" />
                    </Stack>
        }} {...item} />} />

          <Pagination count={14} shape="rounded" renderItem={item => <PaginationItem className="arrow-text" slots={{
          previous: props => <Stack direction="row" alignItems="center" spacing={0.5} {...props}>
                      <ArrowBack fontSize="small" />
                      <Span lineHeight={1} fontSize={14}>
                        Previous
                      </Span>
                    </Stack>,
          next: props => <Stack direction="row" alignItems="center" spacing={0.5} {...props}>
                      <Span lineHeight={1} fontSize={14}>
                        Next
                      </Span>
                      <ArrowForward fontSize="small" />
                    </Stack>
        }} {...item} />} />
        </Box>
      </Box>

      {/* FORM VARIANTS */}
      <Box bgcolor="white" p={3} borderRadius={4}>
        <Typography fontWeight={600} fontSize={16} mb={2}>
          Input Fields
        </Typography>

        <Stack spacing={3}>
          <TextField label="Input" />

          <TextField placeholder="Input" InputProps={{
          startAdornment: <KeyboardArrowDown />
        }} />

          <TextField placeholder="Input" InputProps={{
          endAdornment: <KeyboardArrowDown />
        }} />

          <TextField placeholder="Input" InputProps={{
          endAdornment: <Stack direction="row" alignItems="center" onClick={() => {}} sx={{
            pl: 1.5,
            cursor: "pointer",
            borderLeft: `2px solid ${palette.grey[200]}`
          }}>
                  <Span>Visa</Span> <KeyboardArrowDown />
                </Stack>
        }} />

          <TextField multiline rows={4} label="Description" />
        </Stack>
      </Box>

      {/* Advance and Custom Elements */}
      <Box mb={4}>
        <Box mt={4} bgcolor="white" p={3} borderRadius={4}>
          <Typography fontWeight={600} fontSize={16} mb={3}>
            Advance and Custom Elements
          </Typography>

          <Stack spacing={3} mb={4}>
            <FormControl>
              <FormLabel>Gender</FormLabel>
              <RadioGroup row>
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="male" control={<Radio />} label="Male" />
              </RadioGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Gender</FormLabel>
              <RadioGroup row>
                <FormControlLabel value="female" label="Female" control={<Checkbox icon={<PanoramaFishEye />} checkedIcon={<CheckCircle />} />} />

                <FormControlLabel value="male" label="Male" control={<Checkbox icon={<BlankCheckBoxIcon fontSize="small" />} checkedIcon={<CheckBoxIcon fontSize="small" />} />} />
              </RadioGroup>
            </FormControl>

            <Select size="small" value={country} IconComponent={KeyboardArrowDown} onChange={e => setCountry(e.target.value)} MenuProps={{
            sx: {
              maxHeight: 400
            }
          }} startAdornment={<Avatar alt={country} variant="square" src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${country}.svg`} sx={{
            width: 24,
            height: 24
          }} />}>
              {COUNTRIES.map((item, i) => <MenuItem value={item.value} key={i}>
                  {item.title}
                </MenuItem>)}
            </Select>
          </Stack>

          <Stack direction="row" flexWrap="wrap" gap={3}>
            <Counter />
            <Counter variant="circular" />

            <Counter colors="dark" />
            <Counter colors="dark" variant="circular" />

            <Counter button="outlined" />
            <Counter button="outlined" variant="circular" />
            <Counter button="outlined" colors="dark" />
            <Counter button="outlined" variant="circular" colors="dark" />
          </Stack>
        </Box>
      </Box>

      {/* re */}
      <Box mt={4} bgcolor="white" p={3} borderRadius={4}>
        <Typography fontWeight={600} fontSize={16} mb={3}>
          Text with Icon Breadcrumb
        </Typography>

        <Breadcrumbs aria-label="breadcrumb">
          <NavLink to="/" style={{
          display: "flex",
          alignItems: "center",
          color: "inherit"
        }}>
            <HomeIcon sx={{
            mr: 0.5
          }} fontSize="inherit" />
            Home
          </NavLink>

          <NavLink to="/" style={{
          display: "flex",
          alignItems: "center",
          color: "inherit"
        }}>
            <ShoppingCartOutlined fontSize="inherit" sx={{
            mr: 0.5
          }} />
            Product Page
          </NavLink>

          <NavLink to="/" style={{
          display: "flex",
          alignItems: "center",
          color: palette.grey[400]
        }}>
            <KeyboardTabOutlined fontSize="inherit" sx={{
            mr: 0.5
          }} />
            Active
          </NavLink>
        </Breadcrumbs>

        <Breadcrumbs aria-label="breadcrumb" separator={<Box className="dot" />} sx={{
        my: 2
      }}>
          <NavLink to="/" style={{
          display: "flex",
          alignItems: "center",
          color: "inherit"
        }}>
            <HomeIcon sx={{
            mr: 0.5
          }} fontSize="inherit" />
            Home
          </NavLink>

          <NavLink to="/" style={{
          display: "flex",
          alignItems: "center",
          color: "inherit"
        }}>
            <ShoppingCartOutlined fontSize="inherit" sx={{
            mr: 0.5
          }} />
            Product Page
          </NavLink>

          <NavLink to="/" style={{
          display: "flex",
          alignItems: "center",
          color: palette.grey[400]
        }}>
            <KeyboardTabOutlined fontSize="inherit" sx={{
            mr: 0.5
          }} />
            Active
          </NavLink>
        </Breadcrumbs>

        <Breadcrumbs aria-label="breadcrumb" separator="-">
          <NavLink to="/" style={{
          display: "flex",
          alignItems: "center",
          color: "inherit"
        }}>
            <HomeIcon sx={{
            mr: 0.5
          }} fontSize="inherit" />
            Home
          </NavLink>

          <NavLink to="/" style={{
          display: "flex",
          alignItems: "center",
          color: "inherit"
        }}>
            <ShoppingCartOutlined fontSize="inherit" sx={{
            mr: 0.5
          }} />
            Product Page
          </NavLink>

          <NavLink to="/" style={{
          display: "flex",
          alignItems: "center",
          color: palette.grey[400]
        }}>
            <KeyboardTabOutlined fontSize="inherit" sx={{
            mr: 0.5
          }} />
            Active
          </NavLink>
        </Breadcrumbs>
      </Box>
    </Container>;
};
export default Home;