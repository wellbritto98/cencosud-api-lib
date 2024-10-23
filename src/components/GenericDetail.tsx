import React, { useState, useEffect, useMemo } from "react";
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    Paper,
    TextField,
    CircularProgress,
    Button,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface DetailGenericProps<T, U> {
    title: string;
    fetchEntityDetails: (id: number) => Promise<{ data: T }>;
    updateEntity: (id: number, data: U) => Promise<void>;
    entityFields: {
        name: keyof T;
        description: keyof T;
        status: keyof T;
    };
    relatedItemsTitle?: string;
    fetchRelatedItems?: (id: number) => Promise<{ data: any[] }>;
    entityName: string;
}

const DetailGeneric = <T, U>({
    title,
    fetchEntityDetails,
    updateEntity,
    entityFields,
    relatedItemsTitle,
    fetchRelatedItems,
    entityName
}: DetailGenericProps<T, U>) => {
    const { id } = useParams<{ id: string }>(); // Get the entity ID from the URL
    const [entity, setEntity] = useState<T | null>(null); // Entity data
    const [originalEntity, setOriginalEntity] = useState<T | null>(null); // Original entity data for comparison
    const [relatedItems, setRelatedItems] = useState<any[]>([]); // Related items
    const [loading, setLoading] = useState(true); // Loading state
    const [isSaveDisabled, setIsSaveDisabled] = useState(true); // Save button disabled state

    const [name, setName] = useState(''); // Form fields
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');

    // Fetch entity details on mount
    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;
            try {
                const response = await fetchEntityDetails(Number(id));
                setEntity(response.data);
                setOriginalEntity(response.data); // Store the original data for comparison

                // Initialize form fields with fetched data
                setName(response.data[entityFields.name] as unknown as string);
                setDescription(response.data[entityFields.description] as unknown as string);
                setStatus(response.data[entityFields.status] as unknown as string);

                // Fetch related items, if applicable
                if (fetchRelatedItems) {
                    const relatedItemsResponse = await fetchRelatedItems(Number(id));
                    setRelatedItems(relatedItemsResponse.data);
                }
            } catch (error) {
                console.error(`Erro ao buscar detalhes do ${entityName}:`, error);
                toast.error(`Erro ao buscar detalhes do ${entityName}.`);
                setRelatedItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id, fetchEntityDetails, fetchRelatedItems, entityFields, entityName]);

    // Check if any changes are made to the form fields
    useEffect(() => {
        if (
            entity &&
            (name !== originalEntity?.[entityFields.name] ||
                description !== originalEntity?.[entityFields.description] ||
                status !== originalEntity?.[entityFields.status])
        ) {
            setIsSaveDisabled(false); // Enable save if fields are changed
        } else {
            setIsSaveDisabled(true); // Disable save if no changes
        }
    }, [name, description, status, originalEntity, entity, entityFields]);

    const handleSave = async () => {
        if (!entity) return;

        const updateEntityDto: U = {
            [entityFields.name]: name,
            [entityFields.description]: description,
            [entityFields.status]: status,
        } as unknown as U;

        try {
            await updateEntity(Number(id), updateEntityDto);
            setOriginalEntity({ ...entity, [entityFields.name]: name, [entityFields.description]: description, [entityFields.status]: status }); // Update original entity
            setIsSaveDisabled(true); // Disable save button again
            toast.success(`${entityName} atualizado com sucesso!`); // Success toast
        } catch (error) {
            console.error(`Erro ao atualizar ${entityName}:`, error);
            toast.error(`Erro ao atualizar o ${entityName}. Por favor, tente novamente.`);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, width:"100%" }}>
            <AppBar>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        {name || title}
                    </Typography>
                </Toolbar>
            </AppBar>

            {entity && (
                <>
                    <Typography variant="h4" gutterBottom>
                        {title}: {name}
                    </Typography>
                    <Paper sx={{ p: 2, mb: 4, display: "flex", gap: 5 }}>
                        <TextField label="Nome" value={name} sx={{ width: "40%" }} onChange={(e) => setName(e.target.value)} />
                        <TextField label="Descrição" value={description} sx={{ width: "40%" }} onChange={(e) => setDescription(e.target.value)} />
                        <TextField label="Status" value={status} sx={{ width: "20%" }} onChange={(e) => setStatus(e.target.value)} />
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ width: "20%" }}
                            onClick={handleSave}
                            disabled={isSaveDisabled}
                        >
                            Salvar
                        </Button>
                    </Paper>
                </>
            )}

            {relatedItemsTitle && relatedItems.length > 0 && (
                <>
                    <Typography variant="h5" gutterBottom>
                        {relatedItemsTitle}
                    </Typography>
                    <List>
                        {relatedItems.map((item) => (
                            <ListItem key={item.api.id}>
                                <ListItemText
                                    primary={`${item.api.name} (Versão: ${item.api.version})`}
                                    secondary={`Descrição: ${item.api.description}, URL: ${item.api.baseUrl}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </>
            )}


            {/* ToastContainer is necessary for displaying toast notifications */}
            <ToastContainer />
        </Box>
    );
};

export default DetailGeneric;
