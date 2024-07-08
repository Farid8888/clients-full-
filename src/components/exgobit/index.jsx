import { H5 } from "components/typography";
import { useTranslation } from "react-i18next";

const mappedBanks = [{
    value: "tinkoff",
    text: "Tinkoff"
}, {
    value: "sber",
    text: "Sberbank"
}, {
    value: "raif",
    text: "Raiffeisen"
}, {
    value: "alfa",
    text: "Alfa"
}, {
    value: "otkritie",
    text: "Otkritie"
}, {
    value: "vtb",
    text: "Vtb"
}, {
    value: "qiwi",
    text: "QIWI"
}];

export const Bank = props => {
    const {
        bankCode,
        fiatCode
    } = props;
    const {
        t
    } = useTranslation();

    let found = mappedBanks.find((e) => e.value === bankCode);
    let bankText = found ? found.text : "Unknown";

    return <H5 fontSize={12}>{t(bankText)} {t("Bank")} {fiatCode}</H5>;
};