const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
require("dotenv").config();
const fs = require("fs");

const port = process.env.PORT;
const mongodbUrl = process.env.MONGODB_URL;

const TheaterScreen = require("../server/model/threaterScreenModel");
const Movies = require("../server/model/moviemodel");
const Login = require("./model/loginmodel");
const Event = require("./model/eventmodel");
const Theater = require("./model/theatermodel");
const TicketCountModel = require("./model/ticketcount");
const UserModel = require('./model/usermodel');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose
    .connect(mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

const getalluser = require("./controllers/getallusers");
const getallmovies = require("./controllers/getallmovies");
const logincontroller = require("./controllers/login");
const UserReg = require("./controllers/userregistrartion");
const TheaterReg = require("./controllers/theaterregistration");
const AddShowTime = require("./controllers/theatreapis/addshowtime");
const getShowTime = require("./controllers/theatreapis/getshowtimes");
const forgotpassword = require("./controllers/forgotpassword");
const deleteshowtime = require("./controllers/theatreapis/deleteshowtime");
const assignmovietoscreen = require("./controllers/theatreapis/assign_movie_to_screen");
const usergetshow = require("./controllers/userapis/usergetshow");
const gettr = require("./controllers/userapis/usergettheatre");
const userbookmovies = require("./controllers/userapis/userbookmovies");
const fetchbookedseats = require("./controllers/userapis/fetchbookedseats");
const blockuser = require("./controllers/adminapis/blockuser");
const approvetheaters = require("./controllers/adminapis/approvetheatre");
const savemovies = require("./controllers/userapis/savemovies");
const favmovieslist = require("./controllers/userapis/getfavmovies");
const fetchmyprofile = require("./controllers/userapis/fetchuserdetails");
const getmytickets = require("./controllers/userapis/getuserbookings");
const payment = require("./controllers/userapis/payment");
const updateuserprofile = require("./controllers/userapis/user_update_profile");
const bookingstatictis = require("./controllers/theatreapis/getstatistics");
const hostreg = require("./controllers/hostregistration");
const getallhost = require("./controllers/hostapis/getallhost");
const getallevents = require("./controllers/hostapis/getallevents");
const geteventbyid = require("./controllers/hostapis/geteventbyid");
const eventbooking = require("./controllers/hostapis/eventbooking");
const geteventseats = require("./controllers/hostapis/geteventbookedseats");
const getmyeventbookings = require("./controllers/userapis/getmyeventbookings");
const getcount = require("./controllers/userapis/get-count");
const shortFilmRoutes = require("./controllers/hostapis/addfilm")
const getuserfilmbyid = require('./controllers/hostapis/getfilmsbyuserid');
const getfilms = require('./controllers/userapis/getallshortfilms')
const addcommet = require('./controllers/userapis/add_comment')
const addlikedislike = require('./controllers/userapis/add-like');
const sub = require('./controllers/userapis/subscription');
const getbysub = require('./controllers/userapis/get-my-subscription');


app.use("/api/get-my-subscriptions", getbysub);
app.use("/api/subscriptions", sub);
app.use("/api/like", addlikedislike);
app.use("/api/postcomment", addcommet);
app.use("/api/getshortfilms", getuserfilmbyid);
app.use("/api/hostreg", hostreg);
app.use("/api/getallhost", getallhost);
app.use("/api/getallevents", getallevents);
app.use("/api/geteventbyid", geteventbyid);
app.use("/api/eventbookings", eventbooking);
app.use("/api/fetcheventseats", geteventseats);
app.use("/api/getmyeventbooking", getmyeventbookings);
app.use("/api/ticket_availability", getcount);

app.use("/api/userprofile", updateuserprofile);
app.use("/api/getTicketDetails", getmytickets);
app.use("/payment", payment);
app.use("/api/payment", payment);
app.use("/api/block-user", blockuser);
app.use("/api/getalluser", getalluser);
//------------------------------------------
app.use("/api/getmovies", getallmovies);
app.use("/api/update-movie-streaming-type", getallmovies);
//------------------------------------------
app.use("/api/login", logincontroller);
app.use("/api/register", UserReg);
app.use("/api/theaterreg", TheaterReg);
app.use("/api/assignmovie", assignmovietoscreen);
app.use("/api/getmytheatre-user", gettr);

app.use("/api/getshowtime-user", usergetshow);
app.use("/api/approvetheaters", approvetheaters);
app.use("/api/deleteshowtime", deleteshowtime);
app.use("/api/postshowtime", AddShowTime);
app.use("/api/getshowtime", getShowTime);
app.use("/api/forgotpassword", forgotpassword);
app.use("/api/moviebookings", userbookmovies);
app.use("/api/save-movie", savemovies);
app.use("/api/fetchbookedseats", fetchbookedseats);
app.use("/api/getfavmovies", favmovieslist);
app.use("/api/getfavmovies", favmovieslist);
app.use("/api/user", fetchmyprofile);
app.use("/api/getshortfilms", getfilms);

app.use("/api/statistics", bookingstatictis);

app.use('/api', shortFilmRoutes);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/movie_poster/");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

const storage1 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/event_poster"); // Set the destination folder for uploaded files
    },
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage: storage });
const upload1 = multer({ storage: storage1 });

//profile updation
//----------------------------------------------------------------------------------------------------
const storagepropic = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/profile_picture"); // Set the destination folder for uploaded files
    },
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

const uploadprofilepic = multer({ storage: storagepropic });

app.post('/api/updateprofilepicture/:userId', uploadprofilepic.single('profilepicture'), async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId);
        if (user.profile_picture) {
            const oldImagePath = path.join(__dirname, 'public/profile_picture', user.profile_picture);
            fs.unlinkSync(oldImagePath);
        }
        user.profile_picture = req.file.filename;
        await user.save();
        res.status(200).json({
            message: 'Profile picture updated successfully',
            profilepicture: req.file.filename,
        });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------

app.post("/api/addmovies", upload.single("poster_url"), async (req, res) => {
    try {
        const {
            title,
            StreamingType,
            genre,
            duration,
            release_date,
            language,
            description,
            director,
            production,
            cast,
            trailer_url,
            movie_url
        } = req.body;
        const filename = req.file ? req.file.path : "";
        const poster_url = path.basename(filename);

        const newMovie = new Movies({
            title,
            StreamingType,
            genre,
            duration,
            release_date,
            language,
            description,
            director,
            production,
            cast,
            poster_url,
            trailer_url,
            movie_url: movie_url !== '' ? movie_url : 'no-url'
        });
        const result = await newMovie.save();
        if (result) {

            res.status(201).json({ message: "Movie added successfully" });
        }
    } catch (error) {
        console.error("Error creating movie:", error);
        res.json({ message: "Opertaion Failed" });
    }
});

app.post("/api/addevent", upload1.single("poster_url"), async (req, res) => {
    try {
        const {
            userId,
            event_name,
            event_type,
            location,
            event_date,
            event_time,
            ticket_price,
            description,
            ticket_availability,
            seat_arrangement,
            image_url,
            rows,
            cols,
        } = req.body;
        const filename = req.file ? req.file.path : "";
        const poster_url = path.basename(filename);
        console.log(req.body);
        // Create a new event instance using the Event model
        const newEvent = new Event({
            userId,
            event_name,
            event_type,
            location,
            event_date,
            event_time,
            ticket_price,
            description,
            ticket_availability,
            seat_arrangement,
            poster_url,
            status: "Coming Soon",
            rows,
            cols,
        });

        // Save the event to the database
        const savedEvent = await newEvent.save();
        const count = new TicketCountModel({
            eventId: savedEvent._id,
            ticket_availability,
        });
        const savedCount = await count.save();

        // Respond with a success message and the saved event details
        res.json({ message: "Event Added Successfully", event: savedEvent });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Operation Failed" });
    }
});

app.patch(
    "/api/updateevent/:eventId",
    upload1.single("poster_url"),
    async (req, res) => {
        try {
            const eventId = req.params.eventId; // Extract eventId from request parameters
            const formData = req.body;

            // Check if the poster_url field is present in the request
            const poster_url = req.file
                ? path.basename(req.file.path)
                : formData.poster_url;
            if (req.file) {
                const oldEvent = await Event.findById(eventId);
                if (oldEvent && oldEvent.poster_url) {
                    const oldPosterPath = path.join(
                        __dirname,
                        "public/event_poster",
                        oldEvent.poster_url
                    );
                    fs.unlinkSync(oldPosterPath); // Remove the old poster file
                }
            }

            // Update the event in the database
            const updatedEvent = await Event.findByIdAndUpdate(
                eventId,
                {
                    event_name: formData.event_name,
                    event_type: formData.event_type,
                    location: formData.location,
                    event_date: formData.event_date,
                    event_time: formData.event_time,
                    ticket_price: formData.ticket_price,
                    description: formData.description,
                    ticket_availability: formData.ticket_availability,
                    seat_arrangement: formData.seat_arrangement,
                    poster_url: poster_url, // Use the updated poster_url
                    rows: formData.rows,
                    cols: formData.cols,
                },
                { new: true }
            );

            // Respond with a success message and the updated event details
            res.json({ message: "Event Updated Successfully", event: updatedEvent });
        } catch (error) {
            console.error("Error updating event:", error);
            res.status(500).json({ message: "Operation Failed" });
        }
    }
);

app.patch(
    "/api/update/:movieId",
    upload.single("poster_url"),
    async (req, res) => {
        try {
            const {
                title,
                StreamingType,
                genre,
                duration,
                release_date,
                language,
                description,
                director,
                production,
                cast,
                trailer_url,
                movie_url
            } = req.body;
            const filename = req.file ? req.file.path : "";
            const poster_url = path.basename(filename);

            // Get the movie ID from the route parameter
            const { movieId } = req.params;

            // Create an object to store the non-null fields
            const updatedFields = {
                ...(title && { title }),
                ...(StreamingType && { StreamingType }),
                ...(genre && { genre }),
                ...(duration && { duration }),
                ...(release_date && { release_date }),
                ...(language && { language }),
                ...(description && { description }),
                ...(director && { director }),
                ...(production && { production }),
                ...(cast && { cast }),
                ...(poster_url && { poster_url }),
                ...(trailer_url && { trailer_url }),
                ...(movie_url && { movie_url }),
            };

            // Find the movie by ID and update its details with the non-null fields
            const movie = await Movies.findByIdAndUpdate(movieId, updatedFields);

            if (!movie) {
                return res.status(404).json({ message: "Movie not found" });
            }

            res.status(200).json({ message: "Movie updated successfully" });
        } catch (error) {
            console.error("Error updating movie:", error);
            res.status(500).json({ message: "Operation Failed" });
        }
    }
);

app.delete("/api/movies/:movieId", async (req, res) => {
    try {
        const { movieId } = req.params;
        console.log(movieId);
        const movie = await Movies.findByIdAndRemove(movieId);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        } else {
            console.log("deleted....");
            res.status(200).json({ message: "Movie deleted successfully" });
        }
    } catch (error) {
        console.error("Error deleting movie:", error);
        res.status(500).json({ message: "Operation Failed" });
    }
});

app.get("/api/movies/:movieId", async (req, res) => {
    const { movieId } = req.params;
    console.log(movieId);

    try {
        const currentmovie = await Movies.find({ _id: movieId });
        // console.log(currentmovie)
        res.json(currentmovie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//-----------------------------------------------------------------------------
app.get("/api/theaters", async (req, res) => {
    const email = req.query.theater_email;
    try {
        const theaters = await Theater.find({ theater_email: email });
        console.log(theaters);
        res.status(200).json(theaters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
//------------------------------------------------------------------------------
app.get("/api/theaterlogin", async (req, res) => {
    try {
        const theaters = await Login.find({ usertype: "theater" });
        console.log(theaters);
        res.status(200).json(theaters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

//----------------adding screen------------------------------------------------
app.post("/api/addnewscreen", async (req, res) => {
    try {
        const {
            columns,
            name,
            orientation,
            rows,
            screenType,
            theatertype,
            tremail,
            trid,
        } = req.body;

        // Create a new Theater document based on the request data
        const newTheater = new TheaterScreen({
            trid,
            tremail,
            name,
            screentype: screenType, // Assuming you want to map screenType to screentype
            rows,
            columns,
            orientation,
            theatertype,
        });
        const savedTheater = await newTheater.save();
        res
            .status(201)
            .json({
                message: "New theater screen added successfully",
                theater: savedTheater,
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//-------------------------------------------------------------------------------

app.get("/api/getscreen", async (req, res) => {
    try {
        const theaterid = req.query.id;
        console.log(theaterid);
        const screens = await threaterScreenModel.find({ theaterid: theaterid });
        res.json(screens);
        console.log(screens);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

//========================get user for admin ===============================================================

app.get("/api/getscreenbyid", async (req, res) => {
    try {
        let screenId = req.query.trid;
        console.log("------------");
        console.log(screenId);
        console.log("------------");
        const theaterScreen = await TheaterScreen.find({ trid: screenId });
        console.log(theaterScreen);
        if (!theaterScreen) {
            return res.status(404).json({ message: "Theater screen not found" });
        }

        res.status(200).json({ theaterScreen });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//=======================================================================================


app.get('/api/activate-user', async (req, res) => {
    const id = req.query.id; // Access id from query parameters
    console.log(req.query.id);
    try {
        const updatedUser = await Login.findByIdAndUpdate(id, { status: 'blocked' }, { new: true });
        if (updatedUser) {
            res.redirect('http://localhost:3000/');
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





app.listen(port, () => {
    console.log("server running on port 5000");
});
