import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Button, Card, Grid, styled, Switch, TextField, MenuItem, IconButton } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import * as Yup from "yup";
import { useFormik } from "formik";
// CUSTOM COMPONENTS
import { Paragraph, Small } from "components/typography";
import { FlexBetween, FlexBox } from "components/flexbox";
// CUSTOM DEFINED HOOK
import useClients from "hooks/useClients";
import useTraders from "hooks/useTraders";
import usePaymentProvider from "hooks/usePaymentProvider";
import useNavigate from "hooks/useNavigate";
import useApp from "hooks/useApp";

// STYLED COMPONENTS
const SwitchWrapper = styled(FlexBetween)({
    width: "100%",
    marginTop: 10
});
const StyledIconButton = styled(IconButton)(({
    theme
}) => ({
    backgroundColor: theme.palette.action.selected,
    border: `1px solid ${theme.palette.divider}`
}));

const EditUserPageView = () => {
    let roleInUrl = new URLSearchParams(useLocation().search).get("role");
    const role = roleInUrl ? roleInUrl : "";
    const [user, setUser] = useState(null);
    const [firstSet, setFirstSet] = useState(true);
    const [isBanned, setIsBanned] = useState(false);
    const [tokenCodes, setTokenCodes] = useState([]);
    const [fiatCodes, setFiatCodes] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [permissionsValues, setPermissionsValues] = useState([]);
    const [viewCodes, setViewCodes] = useState([]);
    const [firstPermissions, setFirstPermissions] = useState(true);

    const navigate = useNavigate();

    const {
        editClient,
        clientEditData,
        clientInfo,
        getClientInfo
    } = useClients();

    const {
        editTrader,
        traderEditData,
        traderInfo,
        getTraderInfo
    } = useTraders();

    const {
        fiatProviders,
        tokenProviders,
        updateAllProviders
    } = usePaymentProvider();
    
    const {
        userData
    } = useApp();

    const initialValues = {
        id: userData ? userData.id : "",
        userId: userData ? userData.userId : "",
        userName: userData ? userData.userName : "",
        email: userData ? userData.email : "",
        phone: userData ? userData.phoneNumber : "",
        password: "",
        roleName: "",
        balance:  0,
        balanceLimit:  0,
        isBanned: isBanned,
        permissions: []
    };

    const validationSchema = Yup.object().shape({
        userName: Yup.string().required("Name is Required!"),
        email: Yup.string().email().required("Email is Required!"),
        phone: Yup.number(),
        password: Yup.string(),
        roleName: Yup.string().required("Role is Required!"),
        balance: Yup.number(),
        balanceLimit: Yup.number(),
    });

    const {
        values,
        errors,
        handleChange,
        handleSubmit,
        touched
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit: () => {
            values.permissions = permissionsValues.filter(v => v.code !== "");

            let editData = {
                userId: userData.userId,
                newBalance: values.balance,
                isBanned: isBanned,
                balanceLimit: values.balanceLimit
            };

            if (values.userName !== userData.userName) {
                editData = { ...editData, userName: values.userName }
            }
            if (values.email !== userData.email) {
                editData = { ...editData, email: values.email }
            }
            if (values.phone !== userData.phoneNumber) {
                editData = { ...editData, phone: values.phone }
            }
            if (values.password !== "") {
                editData = { ...editData, password: values.password }
            }
            let editPerm = [];

            values.permissions.forEach(perm => {
                // Если айди нет то это новые права
                if (!perm.id) {
                    let oldFiatPerm = user.fiatPermissions.find(v => v.code === perm.code);
                    let oldTokenPerm = user.tokenPermissions.find(v => v.code === perm.code);

                    // если нет старых пермишенов для токенов или фиатов добавляем
                    if (!oldFiatPerm && !oldTokenPerm) {
                        editPerm.push(perm);
                    }
                } else {
                    let oldFiatPerm = user.fiatPermissions.find(v => v.id === perm.id);
                    // Если найден старый фиат пермишен по айди и новые значения отличаются добавляем
                    if (oldFiatPerm && (oldFiatPerm.canBuy !== perm.canBuy || oldFiatPerm.canSell !== perm.canSell)) {
                        editPerm.push(perm);
                    }

                    let oldTokenPerm = user.tokenPermissions.find(v => v.id === perm.id);

                    // Если найден старый токен пермишен по айди и новые значения отличаются добавляем
                    if (oldTokenPerm && (oldTokenPerm.canBuy !== perm.canBuy || oldTokenPerm.canSell !== perm.canSell)) {
                        editPerm.push(perm);
                    }
                }
            });

            if (editPerm.length !== 0) {
                editData = { ...editData, permissions: editPerm }
            }

            switch (role) {
                case "Client":
                    editData = { ...editData, oldBalance: clientInfo.balance }
                    editClient(editData);
                    break;
                case "Trader":
                    editData = { ...editData, oldBalance: traderInfo.balance }
                    editTrader(editData);
                    break;
                default:
                    alert("RoleName wrong!");
                    break;
            }
        }
    });

    const handleChangeType = (event) => {
        let elId = event.target.name.split(' ')[1];

        let oldViewCodes = viewCodes;
        let oldPermissionsValues = permissionsValues;
        oldPermissionsValues[elId] = {
            ...oldPermissionsValues[elId],
            type: event.target.value,
            code: ""
        };
        setPermissionsValues(oldPermissionsValues);

        switch (event.target.value) {
            case 0:
                oldViewCodes[elId] = tokenCodes;
                setViewCodes(oldViewCodes);
                break;
            case 1:
                oldViewCodes[elId] = fiatCodes;
                setViewCodes(oldViewCodes);
                break;
            default:
                break;
        }

        setPermissions([
            ...permissions
        ]);
    };

    const handleChangeCode = (event) => {
        let elId = event.target.name.split(' ')[1];

        let oldPermissionsValues = permissionsValues;
        oldPermissionsValues[elId] = {
            ...oldPermissionsValues[elId],
            code: event.target.value
        };
        setPermissionsValues(oldPermissionsValues);

        setPermissions([
            ...permissions
        ]);
    };

    const handleChangeBuy = (event) => {
        let elId = event.target.name.split(' ')[1];

        let oldPermissionsValues = permissionsValues;
        oldPermissionsValues[elId] = {
            ...oldPermissionsValues[elId],
            canBuy: event.target.checked
        };
        setPermissionsValues(oldPermissionsValues);

        setPermissions([
            ...permissions
        ]);
    };

    const handleChangeSell = (event) => {
        let elId = event.target.name.split(' ')[1];
        let oldPermissionsValues = permissionsValues;
        oldPermissionsValues[elId] = {
            ...oldPermissionsValues[elId],
            canSell: event.target.checked
        };
        setPermissionsValues(oldPermissionsValues);

        setPermissions([
            ...permissions
        ]);
    };
    
    const handleAddPermission = () => {
        let id = permissions.length;
        let oldViewCodes = viewCodes;
        oldViewCodes[id] = [];
        setViewCodes(oldViewCodes);

        let oldPermissionsValues = permissionsValues;
        oldPermissionsValues[id] = {
            type: "",
            code: "",
            canBuy: false,
            canSell: false,
            selectDisabled: false
        };
        setPermissionsValues(oldPermissionsValues);

        setPermissions([
            ...permissions,
            id
        ]);
    }

    const handleRemovePermission = () => {
        let last_element = permissionsValues[permissionsValues.length - 1];
        if (!last_element.selectDisabled) {
            setPermissions([
                ...permissions.slice(0, -1),
            ]);
            setPermissionsValues([
                ...permissionsValues.slice(0, -1),
            ]);
        }
    };

    const handleChangeBanned = (event) => {
        setIsBanned(event.target.checked);
        let newRole = event.target.checked ? "Banned" : role;
        values.roleName = newRole;
    };
    
    useEffect(() => {
        if (userData && firstSet) {
            setIsBanned(userData.isBanned);
            let newRole = userData.isBanned ? "Banned" : role;

            values.roleName = newRole;
            switch (role) {
                case "Client":
                    getClientInfo(userData);
                    break;
                case "Trader":
                    getTraderInfo(userData);
                    break;
                default:
                    alert("RoleName wrong!");
                    break;
            }
            updateAllProviders();
            setFirstSet(false);
        }

        setTokenCodes(tokenProviders.map(tp => {
            return {
                value: tp.code,
                label: tp.name
            };
        }));

        setFiatCodes(fiatProviders.map(fp => {
            return {
                value: fp.code,
                label: fp.name
            };
        }));

        if (firstPermissions && fiatProviders.length > 0 && tokenProviders.length > 0 && (clientInfo || traderInfo)) {
            if (clientInfo && clientInfo.fiatPermissions) {
                values.balance = clientInfo.balance;
                values.balanceLimit = clientInfo.balanceLimit ? clientInfo.balanceLimit : "";
                setUser(clientInfo);
            }
            if (traderInfo && traderInfo.fiatPermissions) {
                values.balance = traderInfo.balance;
                values.balanceLimit = traderInfo.balanceLimit ? traderInfo.balanceLimit : "";
                setUser(traderInfo);
            }
        }

        if (firstPermissions && fiatProviders.length > 0 && tokenProviders.length > 0 && user && user.fiatPermissions) {
            let newPerm = [...user.fiatPermissions.map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    type: item.type === "TOKEN" ? 0 : 1,
                    code: item.code,
                    canBuy: item.canBuy,
                    canSell: item.canSell,
                    selectDisabled: true
                }
            })];
            newPerm = [...newPerm, ...user.tokenPermissions.map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    type: item.type === "TOKEN" ? 0 : 1,
                    code: item.code,
                    canBuy: item.canBuy,
                    canSell: item.canSell,
                    selectDisabled: true
                }
            })];

            setPermissionsValues(newPerm);
            setPermissions([
                ...newPerm.map((val, index) => {
                    let oldViewCodes = viewCodes;
                    switch (val.type) {
                        case 0:
                            oldViewCodes[index] = tokenCodes;
                            setViewCodes(oldViewCodes);
                            break;
                        case 1:
                            oldViewCodes[index] = fiatCodes;
                            setViewCodes(oldViewCodes);
                            break;
                        default:
                            break;
                    }

                    return index;
                })
            ]);

            setFirstPermissions(false);
        }

        if (!userData || (clientEditData && clientEditData.success) || (traderEditData && traderEditData.success)) {
            navigate(`/dashboard/admin/${role.toLowerCase()}s`);
        }
    }, [clientEditData, clientInfo, fiatCodes, fiatProviders, firstPermissions, firstSet, getClientInfo, getTraderInfo, isBanned, navigate, permissionsValues, role, tokenCodes, tokenProviders, traderEditData, traderInfo, updateAllProviders, user, userData, values, values.roleName, viewCodes]);

    return <Box pt={2} pb={4}>
        <Grid container spacing={3}>
            <Grid item md={8} xs={12}>
                <Card sx={{
                    padding: 3
                }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item sm={6} xs={12}>
                                <TextField
                                    fullWidth
                                    name="userName"
                                    label="User Name"
                                    value={values.userName}
                                    onChange={handleChange}
                                    helperText={touched.userName && errors.userName}
                                    error={Boolean(touched.userName && errors.userName)} />
                            </Grid>

                            <Grid item sm={6} xs={12}>
                                <TextField
                                    fullWidth
                                    name="email"
                                    label="Email Address"
                                    value={values.email}
                                    onChange={handleChange}
                                    helperText={touched.email && errors.email}
                                    error={Boolean(touched.email && errors.email)} />
                            </Grid>

                            <Grid item sm={6} xs={12}>
                                <TextField
                                    fullWidth
                                    name="phone"
                                    label="Phone Number"
                                    value={values.phone}
                                    onChange={handleChange}
                                    helperText={touched.phone && errors.phone}
                                    error={Boolean(touched.phone && errors.phone)} />
                            </Grid>

                            <Grid item sm={6} xs={12}>
                                <TextField
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    value={values.password}
                                    onChange={handleChange}
                                    helperText={touched.password && errors.password}
                                    error={Boolean(touched.password && errors.password)} />
                            </Grid>

                            <Grid item sm={6} xs={12}>
                                <TextField
                                    fullWidth
                                    disabled={true}
                                    name="roleName"
                                    select
                                    label="Role"
                                    value={values.roleName}
                                    onChange={handleChange}
                                    helperText={touched.roleName && errors.roleName}
                                    error={Boolean(touched.roleName && errors.roleName)}>
                                    <MenuItem key={0} value={"Client"}>
                                        {"Client"}
                                    </MenuItem>
                                    <MenuItem key={1} value={"Trader"}>
                                        {"Trader"}
                                    </MenuItem>
                                    <MenuItem key={2} value={"Banned"}>
                                        {"Banned"}
                                    </MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item sm={6} xs={12}>
                                <TextField
                                    fullWidth
                                    name="balance"
                                    label="Balance"
                                    value={values.balance}
                                    onChange={handleChange}
                                    helperText={touched.balance && errors.balance}
                                    error={Boolean(touched.balance && errors.balance)} />
                            </Grid>

                            <Grid item sm={6} xs={12}>
                                <TextField
                                    fullWidth
                                    name="balanceLimit"
                                    label="Balance Limit"
                                    value={values.balanceLimit}
                                    onChange={handleChange}
                                    helperText={touched.balanceLimit && errors.balanceLimit}
                                    error={Boolean(touched.balanceLimit && errors.balanceLimit)} />
                            </Grid>

                            <Grid item sm={12} xs={12}>
                                {permissions.map(id => <FlexBox key={"permission " + id}>
                                    <TextField
                                        key={"type " + id}
                                        fullWidth
                                        disabled={permissionsValues[id].selectDisabled}
                                        name={"type " + id}
                                        select
                                        label="Type Provider"
                                        value={permissionsValues[id].type}
                                        onChange={handleChangeType}>
                                        <MenuItem key={"type " + id + 0} value={0}>
                                            {"Token"}
                                        </MenuItem>
                                        <MenuItem key={"type " + id + 1} value={1}>
                                            {"Fiat"}
                                        </MenuItem>
                                    </TextField>
                                    <TextField
                                        key={"code " + id}
                                        fullWidth
                                        disabled={permissionsValues[id].selectDisabled}
                                        name={"code " + id}
                                        select
                                        label="Code"
                                        value={permissionsValues[id].code}
                                        onChange={handleChangeCode}>
                                        {viewCodes[id] && viewCodes[id].map((val, key) => <MenuItem key={'mcode ' + key} value={val.value}>
                                            {val.label}
                                        </MenuItem>)}
                                    </TextField>
                                    <SwitchWrapper pl={1}>
                                        <Paragraph display="block" fontWeight={600}>
                                            Buy
                                        </Paragraph>
                                        <Switch key={"buy " + id} name={"buy " + id} checked={permissionsValues[id].canBuy} onChange={handleChangeBuy} />
                                    </SwitchWrapper>
                                    <SwitchWrapper pl={1}>
                                        <Paragraph display="block" fontWeight={600}>
                                            Sell
                                        </Paragraph>
                                        <Switch key={"sell " + id} name={"sell " + id} checked={permissionsValues[id].canSell} onChange={handleChangeSell} />
                                    </SwitchWrapper>
                                </FlexBox>)}
                                {permissions.length > 0 && <StyledIconButton size="small" onClick={handleRemovePermission} style={{ marginTop: '5px' }}>
                                    <Remove />
                                </StyledIconButton>}
                                <StyledIconButton size="small" onClick={handleAddPermission} style={{ float: 'right', marginTop: '5px' }}>
                                    <Add />
                                </StyledIconButton>
                            </Grid>

                            <Grid item sm={6} xs={12}>
                                <SwitchWrapper>
                                    <Paragraph display="block" fontWeight={600}>
                                        Banned
                                    </Paragraph>
                                    <Switch checked={isBanned} onChange={handleChangeBanned} />
                                </SwitchWrapper>

                                <Small display="block" color="text.secondary">
                                    Apply disable account
                                </Small>
                            </Grid>

                            <Grid item xs={12}>
                                <Button type="submit" variant="contained">
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Card>
            </Grid>
        </Grid>
    </Box>;
};
export default EditUserPageView;