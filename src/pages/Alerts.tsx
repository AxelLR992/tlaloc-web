import { Button, CircularProgress, Container, createStyles, Grid, makeStyles, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Theme, Typography } from '@material-ui/core';
import React, { FormEvent, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Map, TileLayer, Marker } from 'react-leaflet'
import { useGeolocation } from 'react-use';
import { LeafletMouseEvent } from 'leaflet';
import { db } from '../firebase';
import { GovernmentAlert } from './interfaces';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme: Theme) => createStyles({
    container: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    leafletContainer: {
        height: 400,
        width: "100%",
        margin: "0 auto"
    },
    loadingContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh"
    }
}))

const Alerts = () => {
    const classes = useStyles();
    const initialStateValues = {
        latitude: 0,
        longitude: 0,
        event: "",
        cause: "",
        message: ""
    }
    const [formData, setFormData] = useState(initialStateValues);
    const [alerts, setAlerts] = useState<Array<GovernmentAlert>>([]);

    const initialLocation = useGeolocation({
        enableHighAccuracy: true,
    });

    const handleClick = (e: LeafletMouseEvent) => {
        setFormData({...formData, latitude: e.latlng.lat, longitude: e.latlng.lng})
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const { latitude, longitude, event, cause } = formData;
        if (!latitude || !longitude || ! event || !cause){
            alert("Please fill all the required fields");
            return;
        }
        await db.collection('governmentAlerts').doc().set(formData)
        toast.success("Alert sent successfully");
        setFormData(initialStateValues);
    }

    const getData = async () => {
        db.collection('governmentAlerts').onSnapshot(querySnapshot => {
            const alerts: Array<GovernmentAlert> = [];
            querySnapshot.forEach(res => {
                const governmentAlert: GovernmentAlert = res.data() as GovernmentAlert;
                alerts.push({...governmentAlert, id: res.id});
            });
            setAlerts(alerts);
        })
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            <Navbar />
            <Container className={classes.container}>
                <Typography variant="h3" component="h2">
                    Alerts
                </Typography>
                <div style={{marginTop: 20}}>
                    <Typography style={{marginBottom: 15}}>
                        Create an alert
                    </Typography>
                    <form>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <TextField 
                                        variant="outlined"
                                        label="Choose ubication in the map"
                                        fullWidth
                                        required
                                        value={`${formData.latitude}, ${formData.longitude}`}
                                        InputProps={{
                                            readOnly: true
                                        }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField 
                                        variant="outlined"
                                        label="Event"
                                        fullWidth
                                        select
                                        value={formData.event}
                                        required
                                        onChange={(e) => setFormData({...formData, event: e.target.value})}
                                        >
                                            <MenuItem value="Flood">Flood</MenuItem>
                                            <MenuItem value="Drought">Drought</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField 
                                        variant="outlined"
                                        label="Probable cause"
                                        value={formData.cause}
                                        fullWidth
                                        onChange={(e) => setFormData({...formData, cause: e.target.value})}
                                        select
                                        >
                                            <MenuItem value="Garbage accumulation">Garbage accumulation</MenuItem>
                                            <MenuItem value="Sewerage">Sewerage</MenuItem>
                                            <MenuItem value="Rain">Rain</MenuItem>
                                            <MenuItem value="Lack of rain">Lack of rain</MenuItem>
                                        </TextField>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField 
                                multiline
                                variant="outlined"
                                label="Alert message"
                                fullWidth
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                rows={4}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button onClick={handleSubmit} type="submit" variant="contained" color="primary">Send alert</Button>
                            </Grid>
                            <Grid item xs={12}>
                                {initialLocation.loading ? 
                                    <div className={classes.loadingContainer}>
                                        <CircularProgress />
                                    </div>
                                : 
                                initialLocation.error ? 
                                    <Typography color="error">
                                        {initialLocation.error.message }
                                    </Typography>
                                :
                                initialLocation.latitude && initialLocation.longitude ? 
                                <div>
                                    <Map 
                                    center={[initialLocation.latitude, initialLocation.longitude]} 
                                    zoom={13} 
                                    className={classes.leafletContainer}
                                    onclick={handleClick}
                                    >
                                        <TileLayer
                                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <Marker position={{lat: formData.latitude || initialLocation.latitude, lng: formData.longitude || initialLocation.longitude}} />
                                    </Map>
                                </div>
                                : null
                                }
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <div style={{marginTop: 20}}>
                    <Typography variant="h3" component="h2">
                        Alert History
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Latitude</TableCell>
                                    <TableCell>Longitude</TableCell>
                                    <TableCell>Event</TableCell>
                                    <TableCell>Probable cause</TableCell>
                                    <TableCell>Alert message</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {alerts.map(alert => (
                                    <TableRow key={alert.id}>
                                        <TableCell>{alert.latitude}</TableCell>
                                        <TableCell>{alert.longitude}</TableCell>
                                        <TableCell>{alert.event}</TableCell>
                                        <TableCell>{alert.cause}</TableCell>
                                        <TableCell>{alert.message}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </Container>
        </div>
    );
};

export default Alerts;