import React, {useContext, useEffect, useState} from "react";
import {appContext} from "../context/AppContext";
import {Link, Redirect} from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Search from "../components/Search";
import triangle from "../recursos/triangle.svg";
import fotoPrueba from "../recursos/FotoPrueba1.png";
import califIcon from "../recursos/califIcon.svg";
import usersIcon from "../recursos/usersIcon.svg";
import "./ServiciosDetail.css";
import emptyIcon from "../recursos/emptyIcon.svg";
import {FormattedMessage, useIntl} from 'react-intl'

function ServiciosDetail(props){

    const intl = useIntl();

    const defaultValue = "sinRango";

    const defaultValueOrdenar = "sinOrdenar";

    const context = useContext(appContext);

    const [servicios, setServicios] = useState([])

    const [selectedRango, setSelectedRango] = useState(defaultValue)

    const [porOrden, setPorOrden] = useState(defaultValueOrdenar)

    function handleImputChange(event){
        setSelectedRango(event.target.value)
    }

    function handleOrdenarChange(event){
        setPorOrden(event.target.value)
    }

    function sortHow(){
        if(porOrden==="nombreTrabajador"){
            return (val1, val2) => {
                if (val1.nombreTrabajador.toUpperCase() <= val2.nombreTrabajador.toUpperCase()) return -1;
                else if (val1.nombreTrabajador.toUpperCase() > val2.nombreTrabajador.toUpperCase()) return 1;
                else return 0;
            }
        }else if(porOrden==="precio"){
            return (val1, val2) => {
                return val1.precio <= val2.precio ? -1 : val1.precio > val2.precio ? 1 : 0;
            }
        }
    }

    function filterHow(){
        if(selectedRango==="rango1") return servicio => servicio.precio < 10000
        if(selectedRango==="rango2") return servicio => servicio.precio >= 10000 && servicio.precio < 20000
        if(selectedRango==="rango3") return servicio => servicio.precio >= 20000 && servicio.precio < 30000
        if(selectedRango==="rango4") return servicio => servicio.precio >= 30000 && servicio.precio < 40000
        if(selectedRango==="rango5") return servicio => servicio.precio >= 40000
    }

    useEffect(() => {
        if (!context.user._id) return;
        const pathFetch = props.location.categoria === 'Ver todos'? `/servicios/detalle`:`/servicios/categorias/${props.location.categoria}`
        fetch(pathFetch).then(res => res.json()).then(servicios => {
            let serviciosTmp = []
            servicios.forEach(tmp=>{
                const servicio = {}
                servicio.nombreTrabajador = tmp.trabajador.nombre;
                servicio.calificacion = tmp.calificacion
                servicio.precio = tmp.precio
                servicio.categoria = tmp.categoria
                servicio.id = tmp._id
                serviciosTmp.push(servicio)
            })
            if(selectedRango!==defaultValue)
                serviciosTmp= serviciosTmp.filter(filterHow())
            if(porOrden!==defaultValueOrdenar)
                serviciosTmp.sort(sortHow())
            setServicios(serviciosTmp);
        })
    }, [selectedRango, porOrden]);

    function reset(){
        setSelectedRango(defaultValue)
        setPorOrden(defaultValueOrdenar)
    }

    if (!context.user) return <Redirect to='/'/>;

    if (!props.location.categoria) return <Redirect to='/serviciosCliente'/>;


    return (
        <div className="App">
            <Sidebar/>
            <div className="serviciosDetail">
                <Search/>
                <div className="mainServiciosDetail">
                    <div className="servicioDetailBar">
                        <Link to="/serviciosCliente">
                            <p><FormattedMessage id="Services"/></p>
                        </Link>
                        <img className="triangle" src={triangle} alt="Triangulo"/>
                        <p><FormattedMessage id={props.location.categoria}/></p>
                    </div>
                    <div className="serviceDetailTitle">
                        <h2><FormattedMessage id={props.location.categoria}/></h2>
                    </div>
                    <div className="serviciosFilter row">
                        <div className="col-4">
                        <p className="serviciosFilter-tit"><FormattedMessage id="FilterBy"/></p>
                            <div className="serviciosFilter-det">
                                <div className="dropdown">
                                    <select value={selectedRango} className="form-select" aria-label="Default select example" onChange={handleImputChange}>
                                    <option value="sinRango" name="sinRango">{intl.formatMessage({id: 'PriceHour'})}</option>
                                    <option value="rango1" name="rango1" >{intl.formatMessage({id: 'cero-10'})}</option>
                                    <option value="rango2" name="rango2"  >{intl.formatMessage({id: 'diez-20'})}</option>
                                    <option value="rango3" name="rango3"  >{intl.formatMessage({id: 'veinte-30'})}</option>
                                    <option value="rango4" name="rango4" >{intl.formatMessage({id: 'treinta-40'})}</option>
                                    <option value="rango5" name="rango5"  >{intl.formatMessage({id: 'mas40'})}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-4">
                        <p className="serviciosFilter-tit"><FormattedMessage id="OrderBy"/></p>
                            <div className="serviciosFilter-det">
                                <div className="dropdown">
                                    <select value={porOrden} className="form-select" aria-label="Default select example" onChange={handleOrdenarChange}>
                                    <option value="sinOrdenar" name="nombre" >{intl.formatMessage({id: 'Caracteristica'})}</option>
                                    <option value="nombreTrabajador" name="nombre" >{intl.formatMessage({id: 'Nombre'})}</option>
                                    <option value="precio" name="precio"  >{intl.formatMessage({id: 'Precio'})}</option>
                                    </select>
                                </div>
                                <button onClick={reset}><FormattedMessage id="Clean"/></button>
                            </div>

                        </div>
                    </div>
                    {navigator.onLine ? (
                        <div className="serviceDetailCont">
                        {servicios.length > 0 ? (
                        <div className="row">
                            {servicios.map((item, key) => {
                                return (<div className="card text-center" key={key}>
                                    <div className="card-body cardDetail">
                                        <div className="cardDetail-nombre">
                                            <img className="imgTrabajadorDetail" src={fotoPrueba} alt="Foto Trabajdor"/>
                                            <div className="cardDetail-nombre-det">
                                                <p>{item.nombreTrabajador}</p>
                                                <span><FormattedMessage id={item.categoria}/></span>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className="cardDetail-datos">
                                            <div className="cardDetail-datos-primera">
                                                <img className="detailIcon" src={califIcon} alt="Estrella"/>
                                                <p>{item.calificacion}</p>
                                                <img className="detailIcon" src={usersIcon} alt="Usuarios"/>
                                                <p>78 <FormattedMessage id="citas"/></p>
                                            </div>
                                            <div className="cardDetail-datos-segunda">
                                                <p>$ {item.precio}/<FormattedMessage id="Hour"/></p>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className="buttonCita">
                                            <Link to={{
                                                pathname: "/reservar",
                                                servicio: item,
                                                user: context.user._id
                                            }}>
                                                <p><FormattedMessage id="Schedule"/></p>
                                            </Link>
                                        </div>
                                    </div>
                                </div>)
                            })}

                        </div>)
                        :
                        <div className="emptyPageDet">
                                    <img className="emptyIcon" src={emptyIcon} alt="No Found"/>
                                <p className="emptyPageDet-bold"><FormattedMessage id="NoServCateg"/></p>
                        </div>
                        }  
                    </div>
                    ):
                    <div className="emptyPageDet">
                        <img className="emptyIcon" src={emptyIcon} alt="No Found"/>
                        <p className="emptyPageDet-bold"><FormattedMessage id="serverProblem"/></p>
                        </div>
                    }
                    
                </div>
            </div>
        </div>
    )
}

export default ServiciosDetail;