import { useState, useEffect } from "react";
import { Card, Chip, Box, Table, Switch, Divider, TableRow, TableBody, TableHead, IconButton, Modal, FormControlLabel } from "@mui/material";
import { CopyToClipboard } from "react-copy-to-clipboard";
// CUSTOM COMPONENTS
import { Scrollbar } from "components/scrollbar";
import { FlexBetween, FlexBox } from "components/flexbox";
import { H5, H6, Tiny } from "components/typography";
import CreateWhitelist from "./whitelist/CreateWhitelist";
// CUSTOM ICON COMPONENTS
import Copy from "icons/Copy";
import Delete from "icons/Delete";
import Update from "icons/Update";
import Add from "icons/Add";

import { useTranslation } from "react-i18next";
// COMMON STYLED COMPONENTS
import { BodyTableCellV2, BodyTableRow, HeadTableCell } from "./common/styles";

// CUSTOM HOOKS
import useApiKeys from "hooks/useApiKeys";

const ExgobitApiKeys = () => {
    const [firstFetch, setFirstFetch] = useState(true);
    const {
        apiKeyData,
        generateApiKey,
        switchStatusApiKey,
        removeApiKey,
        getApiKey,
        createApiKeyWhitelist,
        removeApiKeyWhitelist
    } = useApiKeys();

    const styleModal = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        boxShadow: 24,
        padding: 0
    };

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    const handleChange = (event) => {
        switchStatusApiKey();
        //ÂÒÎË ‚‰Û„ ·Û‰ÂÚ ÌÂÒÍÓÎ¸ÍÓ ÍÎ˛˜ÂÈ
        //keys[event.target.name].enabled = event.target.checked

        //setKeys([
        //    ...keys,
        //]);
    };

    const {
        t
    } = useTranslation();

    useEffect(() => {
        if (firstFetch) {
            getApiKey();
            setFirstFetch(false);
        }

    }, [firstFetch, getApiKey]);
    
    return <Card>
        <FlexBetween px={3} py={2}>
            <H6 fontSize={14}>{t("API Overview")}</H6>
        </FlexBetween>

        <Divider sx={{
            my: 2
        }} />

        {/* API KEYS TABLE SECTION */}
        <H5 fontSize={14} p={3}>
            {t("API Keys")}
        </H5>

        <Scrollbar autoHide={false}>
            <Table sx={{
                minWidth: 800
            }}>
                <TableHead>
                    <TableRow>
                        <HeadTableCell>{t("API Keys")}</HeadTableCell>
                        <HeadTableCell>{t("IpAddress")}</HeadTableCell>
                        <HeadTableCell>{t("Created")}</HeadTableCell>
                        <HeadTableCell>{t("Updated")}</HeadTableCell>
                        <HeadTableCell>{t("Status")}</HeadTableCell>
                        <HeadTableCell>{t("Actions")}</HeadTableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {apiKeyData && <BodyTableRow key={0}>
                        <BodyTableCellV2>
                            <FlexBox alignItems="center">
                                <Tiny fontSize={12} minWidth={180}>
                                    {apiKeyData.apiKey && apiKeyData.apiKey.length > 0 ? apiKeyData.apiKey.substring(0, 20) + "***" : "NOT SET"}
                                </Tiny>

                                {apiKeyData.apiKey && <CopyToClipboard text={apiKeyData.apiKey} onCopy={() => true}>
                                    <IconButton color="inherit">
                                        <Copy fontSize="small" />
                                    </IconButton>
                                </CopyToClipboard>}
                            </FlexBox>
                        </BodyTableCellV2>

                        <BodyTableCellV2></BodyTableCellV2>
                        <BodyTableCellV2>{new Date(apiKeyData.createdAt * 1000).toLocaleString()}</BodyTableCellV2>
                        <BodyTableCellV2>{new Date(apiKeyData.updatedAt * 1000).toLocaleString()}</BodyTableCellV2>

                        <BodyTableCellV2>
                            <FormControlLabel
                                label={<Chip size="small" label={apiKeyData.enabled ? "Active" : "Inactive"} color={apiKeyData.enabled ? "success" : "error"} />}
                                control={<Switch checked={apiKeyData.enabled} onChange={handleChange} />}
                                slotProps={{
                                    typography: {
                                        fontSize: 14
                                    }
                                }}
                            />
                        </BodyTableCellV2>

                        <BodyTableCellV2>
                            <FlexBox>
                            <IconButton color="inherit" onClick={() => { generateApiKey() }}>
                                <Update fontSize="small" />
                            </IconButton>
                            <IconButton color="inherit" onClick={() => { removeApiKey() }}>
                                <Delete fontSize="small" />
                            </IconButton>
                            </FlexBox>
                        </BodyTableCellV2>
                    </BodyTableRow>}

                    {apiKeyData && (apiKeyData.whitelist) && apiKeyData.whitelist.map((whitelist, index) => <BodyTableRow key={index}>
                        <BodyTableCellV2></BodyTableCellV2>
                        <BodyTableCellV2>{whitelist.ipAddress}</BodyTableCellV2>
                        <BodyTableCellV2>{new Date(whitelist.createdAt * 1000).toLocaleString()}</BodyTableCellV2>
                        <BodyTableCellV2></BodyTableCellV2>
                        {/*<BodyTableCellV2>{new Date(whitelist.updatedAt * 1000).toLocaleString()}</BodyTableCellV2>*/}

                        <BodyTableCellV2 align='center'>
                            {/*{<Box><Chip size="small" label={whitelist.status === 0 ? "Active" : "Inactive"} color={whitelist.status === 0 ? "success" : "error"} /></Box>}*/}
                            {/* —Ã≈Õ¿ —“¿“”—¿ ¿…œ»*/}
                            {/*<FormControlLabel*/}
                            {/*    label={<Box><Chip size="small" label={whitelist.enabled ? "Active" : "Inactive"} color={whitelist.enabled ? "success" : "error"} /></Box>}*/}
                            {/*    control={<Switch checked={whitelist.enabled} onChange={handleChange} />}*/}
                            {/*    slotProps={{*/}
                            {/*        typography: {*/}
                            {/*            fontSize: 14*/}
                            {/*        }*/}
                            {/*    }}*/}
                            {/*/>*/}
                        </BodyTableCellV2>

                        <BodyTableCellV2 align='center'>
                            <IconButton color="inherit" onClick={() => { removeApiKeyWhitelist(whitelist.id); }}>
                                <Delete fontSize="small" />
                            </IconButton>
                        </BodyTableCellV2>
                    </BodyTableRow>)}

                    <BodyTableRow md={12} xs={12}>
                        <BodyTableCellV2 align='center' md={12} xs={12}>
                            <FlexBox>
                                <Tiny fontSize={22}>{t("Add Ip")}</Tiny>
                                <IconButton color="inherit" onClick={handleOpen}>
                                    <Add fontSize="small" />
                                </IconButton>
                            </FlexBox>
                        </BodyTableCellV2>
                    </BodyTableRow>
                </TableBody>
            </Table>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-verification"
                aria-describedby="modal-send-verification-file">
                <Box sx={styleModal}>
                    <Card sx={{ pl: 3, pr: 3 }}>
                        <CreateWhitelist handleClose={handleClose} createWhitelist={createApiKeyWhitelist} setFirstFetch={setFirstFetch} />
                    </Card>
                </Box>
            </Modal>
        </Scrollbar>
    </Card>;
};

export default ExgobitApiKeys;