import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { normalizeRoles } from "../lib/adminRoles";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

export const AppContext = createContext()

export const AppProvider = ({ children })=>{

    const [isAdmin, setIsAdmin] = useState(false)
    const [shows, setShows] = useState([])
    const [destinations, setDestinations] = useState([])
    const [bookingsApi, setBookingsApi] = useState([])
    const [adminBookings, setAdminBookings] = useState([])
    const [favoriteMovies, setFavoriteMovies] = useState([])
    const [roles, setRoles] = useState([])
    const [rolesLoaded, setRolesLoaded] = useState(false)

    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

    const {user} = useUser()
    const {getToken} = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    const fetchIsAdmin = async ()=>{
        try {
            const {data} = await axios.get('/api/admin/is-admin', {headers: {Authorization: `Bearer ${await getToken()}`}})

            console.log('data: ADMIN', data)
            const normalizedRoles = normalizeRoles(data?.roles || [])
            setRoles(normalizedRoles)
            setIsAdmin(Boolean(data?.isAdmin))
            setRolesLoaded(true)

            if(!data?.isAdmin && location.pathname.startsWith('/admin')){
                navigate('/')
                toast.error('You are not authorized to access admin dashboard')
            }
        } catch (error) {
            console.error(error)
            setIsAdmin(false)
            setRoles([])
            setRolesLoaded(true)
            if(location.pathname.startsWith('/admin')){
                navigate('/')
                toast.error('You are not authorized to access admin dashboard')
            }
        }
    }

    const fetchShows = async ()=>{
        try {
            const { data } = await axios.get('/api/destinations')
            if(data.success){
                setShows(data.destinations || [])
                setDestinations(data.destinations || [])
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
        }
    }

    
    const fetchBookings = async ()=>{
        try {
            const { data } = await axios.get('/api/bookings', {
                params: { limit: 1000 }
            })
            console.log('bookings data:', data)
            if(data.success){
                setBookingsApi(data.bookings || [])
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const fetchAdminBookings = useCallback(async ()=>{
        try {
            const token = getToken ? await getToken() : null;
            if(!token){
                setAdminBookings([])
                return;
            }

            const { data } = await axios.get('/api/admin/all-bookings', {
                headers: {Authorization: `Bearer ${token}`}
            })

            if(data?.success){
                setAdminBookings(data.bookings || [])
            }else{
                toast.error(data?.message || "Unable to load admin bookings")
            }
        } catch (error) {
            console.error(error)
        }
    }, [getToken])

    const fetchFavoriteMovies = useCallback(async ()=>{
        try {
            const token = getToken ? await getToken() : null;
            if(!token){
                setFavoriteMovies([]);
                return;
            }

            const { data } = await axios.get('/api/user/favorites', {
                headers: {Authorization: `Bearer ${token}`}
            })

            if(data?.success){
                setFavoriteMovies(data.destinations || data.movies || [])
            }else{
                toast.error(data?.message || 'Unable to load favorites')
                setFavoriteMovies([])
            }
        } catch (error) {
            console.error(error)
            setFavoriteMovies([])
        }
    }, [axios, getToken])

    useEffect(()=>{
        fetchShows()
        fetchBookings()
    },[])

    useEffect(()=>{
        if(user){
            fetchIsAdmin()
            fetchFavoriteMovies()
        } else {
            setFavoriteMovies([])
        }
    },[user, fetchFavoriteMovies])

    const value = {
        axios,
        fetchIsAdmin,
        fetchShows,
        user, getToken, navigate, isAdmin, roles, rolesLoaded, shows, destinations, bookingsApi,
        adminBookings, fetchAdminBookings,
        favoriteMovies, fetchFavoriteMovies, image_base_url, fetchBookings
    }

    return (
        <AppContext.Provider value={value}>
            { children }
        </AppContext.Provider>
    )
}

export const useAppContext = ()=> useContext(AppContext)
