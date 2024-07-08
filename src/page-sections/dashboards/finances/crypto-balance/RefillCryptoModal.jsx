import { useState } from 'react';
import { H6 } from "components/typography";
import Modal from '@mui/material/Modal';
import { Box, Button, Card, } from "@mui/material";
import { useTranslation } from "react-i18next";
import CryptoRefillForm from './CryptoRefillForm';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    boxShadow: 24,
    padding: 0
};

export default function RefillCryptoModal(props) {
    const {
        user
    } = props;

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const {
        t
    } = useTranslation();

    return (
        <div>
            <Button title={t("Refill balance")} onClick={() => {
                handleOpen();
            }}>
                {t("Refill balance")}
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} py={3}>
                    <Card sx={{ p: 3 }}>
                        <H6 fontSize={18} sx={{ mb: 2 }}>{t("Refill balance title")}</H6>
                        <CryptoRefillForm handleClose={handleClose} />
                    </Card>
                </Box>
            </Modal>
        </div>
    );
}