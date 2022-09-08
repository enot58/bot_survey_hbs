import sequelize from "./db.js";
import express, {raw, response} from "express";
import handlebars from "express-handlebars";
const urlencodedParser = express.urlencoded({extended: false});
const app = express();
import models from "./models/models.js"




app.use(express.json());
// ==========================================================================================
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
// ==========================================================================================



// синхронизация с бд, после успшной синхронизации запускаем сервер
// sequelize.sync().then(() => {
//     app.listen(3000, function () {
//         console.log("Сервер ожидает подключения...");
//     });
// }).catch(err => console.log(err));

(async () => {
    await sequelize.sync().then( () => [
        app.listen(3000, function () {
            console.log("Сервер ожидает подключения...");
        })
    ]);
})();


// Обработаем главную
app.get("/", async (request, response) => {


    // Передаём всех пользователей
    models.User.findAll({
        raw: true,
        include: [
            {
                model: models.ObjectBuilds,

            },
            {
                model: models.PropertyMeter,

            }
        ]

    })
        .then((dats) => {
            const nObj = []
            dats.map((dats, index ) => {
                nObj.push({
                    id: dats.id,
                    name: dats.name,
                    numberFlat: dats.numberFlat,
                    typeMeter: dats['property_meters.typeMeterId'],
                    numberMeter: dats['property_meters.number'],
                    numberM3: dats['property_meters.numM3'],
                    answer: dats['property_meters.question'],
                    createMeter: dats['property_meters.createdAt'],
                    updateMeter: dats['property_meters.updatedAt']
                })
            })

            console.log(nObj)

            response.render('index', {
                users: nObj
            })
            /*dats.map((dats, index ) => {
                nObj.push({
                    id: dats.id,
                    name: dats.name,
                    numberFlat: dats.numberFlat,
                })
            })*/
            /*console.log(dats)*/
        })
        .catch((err) => {
            response.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            })
        })
    /*console.log(nObj)
    nObj.map((obj) => {
        response.render('index', {
                users: obj
            })
    })*/


    /*const allUsers = await models.User.findAll({
       /!* include: [
            models.ObjectBuilds,

        ]*!/
        raw: true
    }).then(
        async (data) => {
            console.log(data)
            await models.ObjectBuilds.findOne({
                while: data.objectBuildId,
                raw: true
            }).then(
                async (result) => {

                    console.log(data)
                    console.log(result)
                    await response.render('index', {
                        users: data

                    })
                }
            )


        }
    )*/



});


//  Пост запрос на удаление
app.post('/delete/:id', (request, response) => {
    const userId = request.params.id;
    models.User.destroy({
        where: {id: userId}
    }).then(() => {
        response.redirect('/');
    })
})


app.post('/deleteMeter/:id', (request, response) => {
    const meterId = request.params.id;
    console.log(meterId)
    models.PropertyMeter.destroy({
        where: {id: meterId}
    }).then(() => {
        response.redirect('/viewMeter');
    })
})

// Редактирование(переход на страницу редактирования по Id)
app.get('/edit/:id', (request, response) => {
    const userid = request.params.id;
    // Передаём всех пользователей
    models.User.findAll({
        where: {
            id: userid
        },
        raw: true,
        include: [
            {
                model: models.ObjectBuilds,

            },
            {
                model: models.PropertyMeter,

            }
        ]

    })
        .then((dats) => {
            const nObj = []
            dats.map((dats, index ) => {
                nObj.push({
                    id: dats.id,
                    name: dats.name,
                    numberFlat: dats.numberFlat,
                    typeMeter: dats['property_meters.typeMeterId'],
                    numberMeter: dats['property_meters.number'],
                    numberM3: dats['property_meters.numM3'],
                    answer: dats['property_meters.question'],
                    createMeter: dats['property_meters.createdAt'],
                    updateMeter: dats['property_meters.updatedAt']
                })
            })

            console.log(nObj)

            response.render('edit', {
                user: nObj
            })
            /*dats.map((dats, index ) => {
                nObj.push({
                    id: dats.id,
                    name: dats.name,
                    numberFlat: dats.numberFlat,
                })
            })*/
            /*console.log(dats)*/
        })
        .catch((err) => {
            response.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            })
        })
    /*models.User.findAll({where:{id: userid}, raw: true })
        .then(data=>{
            response.render("edit", {
                user: data[0]
            });
        })
        .catch(err=>console.log(err));*/
})




// Обрабатываем пост запрос на редактирование
app.post('/edit', urlencodedParser,(request, response) => {
    if(!request.body) {
        return response.status(400);
    }

    const userName = request.body.name;
    const userAge = request.body.age;
    const userId = request.body.id;

    models.User.update({
            name: userName,
            age: userAge,
            id: userId
        },
        {
            where: {id: userId}
        }
    ).then(() => {
        response.redirect('/')
    }).catch((err) => {
        console.log(err)
    })
})



app.get("/viewMeter", async (request, response) => {

 // Передаём все счётчики

 models.PropertyMeter.findAll({
    raw: true,


})
    .then((dats) => {
        const nObj = []
        dats.map((dats, index ) => {
            nObj.push({
                id: dats.id,
                number: dats.number,
                numM3: dats.numM3,
                userId: dats.userId,
                typeMeterId: dats.typeMeterId,
                createdAt: dats.createdAt,
                updatedAt: dats.updatedAt
            })
        })

        console.log(nObj)

        response.render('viewMeter', {
            meters: nObj
        })
        /*dats.map((dats, index ) => {
            nObj.push({
                id: dats.id,
                name: dats.name,
                numberFlat: dats.numberFlat,
            })
        })*/
        /*console.log(dats)*/
    })
    .catch((err) => {
        response.status(500).send({
            message: err.message || "Some error occurred while retrieving tutorials."
        })
    })
    



});


