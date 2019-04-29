// connect to mysql database here

const mysql = require('mysql');
const config = require('./config.js');
const dbconnect = require('./db');


//test that mysql is connection
module.exports = dbconnect.connect( (err) => {

	dbconnect.database = config.db_name;

	const con = dbconnect;



	  if (!err) {
	  	
		con.query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = " + config.db_name,  (err, result) => {

			if (!err) {

				
				migrations(con);


			}else{
			
				con.query("CREATE DATABASE IF NOT EXISTS " + config.db_name ,  (err,result) => {

					if (!err) {
						
						migrations(con);

					}else{
						
						console.log(err);
					}

				});
			}

		});

  }else{
  	
  		console.log("Connection was not established",err);
  }

});


const migrations = (con)=>{

	let queries = [
						"CREATE TABLE IF NOT EXISTS " + config.db_name + ".users ( id INT(11) NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL , email VARCHAR(255) NULL DEFAULT NULL , password VARCHAR(255) NULL DEFAULT NULL , phone VARCHAR(255) NULL DEFAULT NULL , dob VARCHAR(255) NULL DEFAULT NULL , tosAgreement BOOLEAN NULL DEFAULT NULL , provider VARCHAR(255) NULL DEFAULT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT(1) NOT NULL DEFAULT '1' , PRIMARY KEY (id), UNIQUE (uuid, phone, email)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS "  + config.db_name + ".profiles ( id INT(11) NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL , nationality_origin VARCHAR(255) NOT NULL, nationality_residence VARCHAR(255) NOT NULL , state VARCHAR(255) NOT NULL , lga VARCHAR(255) NOT NULL , firstName VARCHAR(255) NOT NULL , lastName VARCHAR(255) NOT NULL , photo VARCHAR(255) NOT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (id)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS " + config.db_name + ".tokens ( id INT(11) NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NULL DEFAULT NULL , token VARCHAR(255) NULL DEFAULT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT(1) NULL DEFAULT NULL , PRIMARY KEY (id)) ENGINE = InnoDB;",
				
						"CREATE TABLE IF NOT EXISTS " + config.db_name + ".posts ( id INT NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL, user VARCHAR(255) NOT NULL , post TEXT NOT NULL ,  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT(1) NULL DEFAULT NULL , location VARCHAR(255) NULL DEFAULT NULL, attachment VARCHAR(255) NULL DEFAULT NULL, post_type VARCHAR(255) NULL DEFAULT 'post', PRIMARY KEY (id)) ENGINE = InnoDB;",
						
						"CREATE TABLE IF NOT EXISTS " + config.db_name + ".articles ( id INT NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL, user VARCHAR(255) NOT NULL , article TEXT NOT NULL , article_title TEXT NOT NULL ,  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT(1) NULL DEFAULT NULL , location VARCHAR(255) NULL DEFAULT NULL, attachment VARCHAR(255) NULL DEFAULT NULL, post_type VARCHAR(255) NULL DEFAULT 'post', PRIMARY KEY (id)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS "+ config.db_name + ".comments ( id INT NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL , comment TEXT NOT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT NULL DEFAULT '1' , ref VARCHAR(255) NOT NULL , user VARCHAR(255) NOT NULL , PRIMARY KEY (id), UNIQUE (uuid)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS " + config.db_name + ".reactions ( id INT NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL , post VARCHAR(255) NOT NULL ,user VARCHAR(255) NOT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT NOT NULL DEFAULT '1' , PRIMARY KEY (id)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS " + config.db_name + ".shares ( id INT NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL , post VARCHAR(255) NOT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT NOT NULL DEFAULT '1' , PRIMARY KEY (id)) ENGINE = InnoDB;",
						
						"CREATE TABLE IF NOT EXISTS " + config.db_name + ".views ( id INT NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL , post VARCHAR(255) NOT NULL, user VARCHAR(255) NOT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT NOT NULL DEFAULT '1' , PRIMARY KEY (id)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS " +config.db_name + ".friends ( id INT NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL, user_a VARCHAR(255) NOT NULL , user_b VARCHAR(255) NOT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT(1) NOT NULL DEFAULT '1' , PRIMARY KEY (id)) ENGINE = InnoDB;",
						
						"CREATE TABLE IF NOT EXISTS " +config.db_name + ".friendrequests ( id INT NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL, request_sender VARCHAR(255) NOT NULL , request_receiver VARCHAR(255) NOT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , status INT(1) NOT NULL DEFAULT '0' , PRIMARY KEY (id)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS " + config.db_name + ".polls ( id INT NOT NULL AUTO_INCREMENT , uuid VARCHAR(255) NOT NULL , sector VARCHAR(255) NOT NULL , opinion TEXT NOT NULL , created_by VARCHAR(255) NOT NULL , created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , expire_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP , status INT(1) NOT NULL DEFAULT 0 , response_limit INT(255) NULL , PRIMARY KEY (id)) ENGINE = InnoDB",

						"CREATE TABLE IF NOT EXISTS "+ config.db_name + ".polls_response ( id INT NOT NULL AUTO_INCREMENT , poll VARCHAR(255) NOT NULL , user VARCHAR(255) NOT NULL , status INT(1) NOT NULL DEFAULT '0', created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (id)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS "+config.db_name+" .password_reset (id INT NOT NULL AUTO_INCREMENT, uuid VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, code VARCHAR(255) NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, status INT(1) NOT NULL DEFAULT '0' , PRIMARY KEY (id)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS "+config.db_name+".messages (id INT NOT NULL AUTO_INCREMENT, uuid VARCHAR(255) NOT NULL, sender VARCHAR(255) NOT NULL, receiver VARCHAR(255) NOT NULL, content TEXT NOT NULL, attachments TEXT NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, status INT(1) NOT NULL DEFAULT '0' , PRIMARY KEY (id)) ENGINE = InnoDB;",
						
						"CREATE TABLE IF NOT EXISTS "+config.db_name+".replies (id INT NOT NULL AUTO_INCREMENT, uuid VARCHAR(255) NOT NULL, sender VARCHAR(255) NOT NULL, receiver VARCHAR(255) NOT NULL, content TEXT NOT NULL, message VARCHAR(255) NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, status INT(1) NOT NULL DEFAULT '0' , PRIMARY KEY (id)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS " +config.db_name+".executives (id INT NOT NULL AUTO_INCREMENT, uuid VARCHAR(255) NOT NULL, user VARCHAR(255) NOT NULL, party VARCHAR(255) NOT NULL, admin VARCHAR(255) NOT NULL, about_you TEXT NOT NULL, about_party TEXT NOT NULL, office VARCHAR(255) NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, status INT(1) NOT NULL DEFAULT '0' , PRIMARY KEY (id)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS " +config.db_name+".petitions (id INT NOT NULL AUTO_INCREMENT, uuid VARCHAR(255) NOT NULL, user VARCHAR(255) NOT NULL, targeted_office VARCHAR(255) NOT NULL, petition_class VARCHAR(255) NOT NULL, petition_title TEXT NOT NULL, attachment VARCHAR(255) NULL DEFAULT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, status INT(1) NOT NULL DEFAULT '0' , PRIMARY KEY (id)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS " +config.db_name+ ".petitions_sign (id INT NOT NULL AUTO_INCREMENT, uuid VARCHAR(255) NOT NULL, petition VARCHAR(255) NOT NULL, user VARCHAR(255) NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, status INT(1) NOT NULL DEFAULT '0' , PRIMARY KEY (id)) ENGINE = InnoDB;",

						"CREATE TABLE IF NOT EXISTS "+ config.db_name +".states ( id int NOT NULL AUTO_INCREMENT, name varchar(100) NOT NULL, PRIMARY KEY (id) ) ENGINE=InnoDB;",

						"INSERT INTO states (id, name) VALUES (1, 'Abia State'), (2, 'Adamawa State'), (3, 'Akwa Ibom State'), (4, 'Anambra State'), (5, 'Bauchi State'), (6, 'Bayelsa State'), (7, 'Benue State'), (8, 'Borno State'), (9, 'Cross River State'), (10, 'Delta State'), (11, 'Ebonyi State'), (12, 'Edo State'), (13, 'Ekiti State'), (14, 'Enugu State'), (15, 'FCT'), (16, 'Gombe State'), (17, 'Imo State'), (18, 'Jigawa State'), (19, 'Kaduna State'), (20, 'Kano State'), (21, 'Katsina State'), (22, 'Kebbi State'), (23, 'Kogi State'), (24, 'Kwara State'), (25, 'Lagos State'), (26, 'Nasarawa State'), (27, 'Niger State'), (28, 'Ogun State'), (29, 'Ondo State'), (30, 'Osun State'), (31, 'Oyo State'), (32, 'Plateau State'), (33, 'Rivers State'), (34, 'Sokoto State'), (35, 'Taraba State'), (36, 'Yobe State'), (37, 'Zamfara State'); ",

						"CREATE TABLE IF NOT EXISTS lga ( id int NOT NULL AUTO_INCREMENT, state_id int(11) NOT NULL, name varchar(100) NOT NULL, PRIMARY KEY (id) ) ENGINE=InnoDB ; ",

						"INSERT INTO lga (state_id, name) VALUES (1, 'Aba South'), (1, 'Arochukwu'), (1, 'Bende'), (1, 'Ikwuano'), (1, 'Isiala Ngwa North'), (1, 'Isiala Ngwa South'), (1, 'Isuikwuato'), (1, 'Obi Ngwa'), (1, 'Ohafia'), (1, 'Osisioma'), (1, 'Ugwunagbo'), (1, 'Ukwa East'), (1, 'Ukwa West'), (1, 'Umuahia North'), (1, 'Umuahia South'), (1, 'Umu Nneochi'), (2, 'Fufure'), (2, 'Ganye'), (2, 'Gayuk'), (2, 'Gombi'), (2, 'Grie'), (2, 'Hong'), (2, 'Jada'), (2, 'Lamurde'), (2, 'Madagali'), (2, 'Maiha'), (2, 'Mayo Belwa'), (2, 'Michika'), (2, 'Mubi North'), (2, 'Mubi South'), (2, 'Numan'), (2, 'Shelleng'), (2, 'Song'), (2, 'Toungo'), (2, 'Yola North'), (2, 'Yola South'), (3, 'Eastern Obolo'), (3, 'Eket'), (3, 'Esit Eket'), (3, 'Essien Udim'), (3, 'Etim Ekpo'), (3, 'Etinan'), (3, 'Ibeno'), (3, 'Ibesikpo Asutan'), (3, 'Ibiono-Ibom'), (3, 'Ika'), (3, 'Ikono'), (3, 'Ikot Abasi'), (3, 'Ikot Ekpene'), (3, 'Ini'), (3, 'Itu'), (3, 'Mbo'), (3, 'Mkpat-Enin'), (3, 'Nsit-Atai'), (3, 'Nsit-Ibom'), (3, 'Nsit-Ubium'), (3, 'Obot Akara'), (3, 'Okobo'), (3, 'Onna'), (3, 'Oron'), (3, 'Oruk Anam'), (3, 'Udung-Uko'), (3, 'Ukanafun'), (3, 'Uruan'), (3, 'Urue-Offong/Oruko'), (3, 'Uyo'), (4, 'Anambra East'), (4, 'Anambra West'), (4, 'Anaocha'), (4, 'Awka North'), (4, 'Awka South'), (4, 'Ayamelum'), (4, 'Dunukofia'), (4, 'Ekwusigo'), (4, 'Idemili North'), (4, 'Idemili South'), (4, 'Ihiala'), (4, 'Njikoka'), (4, 'Nnewi North'), (4, 'Nnewi South'), (4, 'Ogbaru'), (4, 'Onitsha North'), (4, 'Onitsha South'), (4, 'Orumba North'), (4, 'Orumba South'), (4, 'Oyi'), (5, 'Bauchi'), (5, 'Bogoro'), (5, 'Damban'), (5, 'Darazo'), (5, 'Dass'), (5, 'Gamawa'), (5, 'Ganjuwa'), (5, 'Giade'), (5, 'Itas/Gadau'), (5, 'Jama''are'), (5, 'Katagum'), (5, 'Kirfi'), (5, 'Misau'), (5, 'Ningi'), (5, 'Shira'), (5, 'Tafawa Balewa'), (5, 'Toro'), (5, 'Warji'), (5, 'Zaki'), (6, 'Ekeremor'), (6, 'Kolokuma/Opokuma'), (6, 'Nembe'), (6, 'Ogbia'), (6, 'Sagbama'), (6, 'Southern Ijaw'), (6, 'Yenagoa'), (7, 'Apa'), (7, 'Ado'), (7, 'Buruku'), (7, 'Gboko'), (7, 'Guma'), (7, 'Gwer East'), (7, 'Gwer West'), (7, 'Katsina-Ala'), (7, 'Konshisha'), (7, 'Kwande'), (7, 'Logo'), (7, 'Makurdi'), (7, 'Obi'), (7, 'Ogbadibo'), (7, 'Ohimini'), (7, 'Oju'), (7, 'Okpokwu'), (7, 'Oturkpo'), (7, 'Tarka'), (7, 'Ukum'), (7, 'Ushongo'), (7, 'Vandeikya'), (8, 'Askira/Uba'), (8, 'Bama'), (8, 'Bayo'), (8, 'Biu'), (8, 'Chibok'), (8, 'Damboa'), (8, 'Dikwa'), (8, 'Gubio'), (8, 'Guzamala'), (8, 'Gwoza'), (8, 'Hawul'), (8, 'Jere'), (8, 'Kaga'), (8, 'Kala/Balge'), (8, 'Konduga'), (8, 'Kukawa'), (8, 'Kwaya Kusar'), (8, 'Mafa'), (8, 'Magumeri'), (8, 'Maiduguri'), (8, 'Marte'), (8, 'Mobbar'), (8, 'Monguno'), (8, 'Ngala'), (8, 'Nganzai'), (8, 'Shani'), (9, 'Akamkpa'), (9, 'Akpabuyo'), (9, 'Bakassi'), (9, 'Bekwarra'), (9, 'Biase'), (9, 'Boki'), (9, 'Calabar Municipal'), (9, 'Calabar South'), (9, 'Etung'), (9, 'Ikom'), (9, 'Obanliku'), (9, 'Obubra'), (9, 'Obudu'), (9, 'Odukpani'), (9, 'Ogoja'), (9, 'Yakuur'), (9, 'Yala'), (10, 'Aniocha South'), (10, 'Bomadi'), (10, 'Burutu'), (10, 'Ethiope East'), (10, 'Ethiope West'), (10, 'Ika North East'), (10, 'Ika South'), (10, 'Isoko North'), (10, 'Isoko South'), (10, 'Ndokwa East'), (10, 'Ndokwa West'), (10, 'Okpe'), (10, 'Oshimili North'), (10, 'Oshimili South'), (10, 'Patani'), (10, 'Sapele'), (10, 'Udu'), (10, 'Ughelli North'), (10, 'Ughelli South'), (10, 'Ukwuani'), (10, 'Uvwie'), (10, 'Warri North'), (10, 'Warri South'), (10, 'Warri South West'), (11, 'Afikpo North'), (11, 'Afikpo South'), (11, 'Ebonyi'), (11, 'Ezza North'), (11, 'Ezza South'), (11, 'Ikwo'), (11, 'Ishielu'), (11, 'Ivo'), (11, 'Izzi'), (11, 'Ohaozara'), (11, 'Ohaukwu'), (11, 'Onicha'), (12, 'Egor'), (12, 'Esan Central'), (12, 'Esan North-East'), (12, 'Esan South-East'), (12, 'Esan West'), (12, 'Etsako Central'), (12, 'Etsako East'), (12, 'Etsako West'), (12, 'Igueben'), (12, 'Ikpoba Okha'), (12, 'Orhionmwon'), (12, 'Oredo'), (12, 'Ovia North-East'), (12, 'Ovia South-West'), (12, 'Owan East'), (12, 'Owan West'), (12, 'Uhunmwonde'), (13, 'Efon'), (13, 'Ekiti East'), (13, 'Ekiti South-West'), (13, 'Ekiti West'), (13, 'Emure'), (13, 'Gbonyin'), (13, 'Ido Osi'), (13, 'Ijero'), (13, 'Ikere'), (13, 'Ikole'), (13, 'Ilejemeje'), (13, 'Irepodun/Ifelodun'), (13, 'Ise/Orun'), (13, 'Moba'), (13, 'Oye'), (14, 'Awgu'), (14, 'Enugu East'), (14, 'Enugu North'), (14, 'Enugu South'), (14, 'Ezeagu'), (14, 'Igbo Etiti'), (14, 'Igbo Eze North'), (14, 'Igbo Eze South'), (14, 'Isi Uzo'), (14, 'Nkanu East'), (14, 'Nkanu West'), (14, 'Nsukka'), (14, 'Oji River'), (14, 'Udenu'), (14, 'Udi'), (14, 'Uzo Uwani'), (15, 'Bwari'), (15, 'Gwagwalada'), (15, 'Kuje'), (15, 'Kwali'), (15, 'Municipal Area Council'), (16, 'Balanga'), (16, 'Billiri'), (16, 'Dukku'), (16, 'Funakaye'), (16, 'Gombe'), (16, 'Kaltungo'), (16, 'Kwami'), (16, 'Nafada'), (16, 'Shongom'), (16, 'Yamaltu/Deba'), (17, 'Ahiazu Mbaise'), (17, 'Ehime Mbano'), (17, 'Ezinihitte'), (17, 'Ideato North'), (17, 'Ideato South'), (17, 'Ihitte/Uboma'), (17, 'Ikeduru'), (17, 'Isiala Mbano'), (17, 'Isu'), (17, 'Mbaitoli'), (17, 'Ngor Okpala'), (17, 'Njaba'), (17, 'Nkwerre'), (17, 'Nwangele'), (17, 'Obowo'), (17, 'Oguta'), (17, 'Ohaji/Egbema'), (17, 'Okigwe'), (17, 'Orlu'), (17, 'Orsu'), (17, 'Oru East'), (17, 'Oru West'), (17, 'Owerri Municipal'), (17, 'Owerri North'), (17, 'Owerri West'), (17, 'Unuimo'), (18, 'Babura'), (18, 'Biriniwa'), (18, 'Birnin Kudu'), (18, 'Buji'), (18, 'Dutse'), (18, 'Gagarawa'), (18, 'Garki'), (18, 'Gumel'), (18, 'Guri'), (18, 'Gwaram'), (18, 'Gwiwa'), (18, 'Hadejia'), (18, 'Jahun'), (18, 'Kafin Hausa'), (18, 'Kazaure'), (18, 'Kiri Kasama'), (18, 'Kiyawa'), (18, 'Kaugama'), (18, 'Maigatari'), (18, 'Malam Madori'), (18, 'Miga'), (18, 'Ringim'), (18, 'Roni'), (18, 'Sule Tankarkar'), (18, 'Taura'), (18, 'Yankwashi'), (19, 'Chikun'), (19, 'Giwa'), (19, 'Igabi'), (19, 'Ikara'), (19, 'Jaba'), (19, 'Jema'), (19, 'Kachia'), (19, 'Kaduna North'), (19, 'Kaduna South'), (19, 'Kagarko'), (19, 'Kajuru'), (19, 'Kaura'), (19, 'Kauru'), (19, 'Kubau'), (19, 'Kudan'), (19, 'Lere'), (19, 'Makarfi'), (19, 'Sabon Gari'), (19, 'Sanga'), (19, 'Soba'), (19, 'Zangon Kataf'), (19, 'Zaria'), (20, 'Albasu'), (20, 'Bagwai'), (20, 'Bebeji'), (20, 'Bichi'), (20, 'Bunkure'), (20, 'Dala'), (20, 'Dambatta'), (20, 'Dawakin Kudu'), (20, 'Dawakin Tofa'), (20, 'Doguwa'), (20, 'Fagge'), (20, 'Gabasawa'), (20, 'Garko'), (20, 'Garun Mallam'), (20, 'Gaya'), (20, 'Gezawa'), (20, 'Gwale'), (20, 'Gwarzo'), (20, 'Kabo'), (20, 'Kano Municipal'), (20, 'Karaye'), (20, 'Kibiya'), (20, 'Kiru'), (20, 'Kumbotso'), (20, 'Kunchi'), (20, 'Kura'), (20, 'Madobi'), (20, 'Makoda'), (20, 'Minjibir'), (20, 'Nasarawa'), (20, 'Rano'), (20, 'Rimin Gado'), (20, 'Rogo'), (20, 'Shanono'), (20, 'Sumaila'), (20, 'Takai'), (20, 'Tarauni'), (20, 'Tofa'), (20, 'Tsanyawa'), (20, 'Tudun Wada'), (20, 'Ungogo'), (20, 'Warawa'), (20, 'Wudil'), (21, 'Batagarawa'), (21, 'Batsari'), (21, 'Baure'), (21, 'Bindawa'), (21, 'Charanchi'), (21, 'Dandume'), (21, 'Danja'), (21, 'Dan Musa'), (21, 'Daura'), (21, 'Dutsi'), (21, 'Dutsin Ma'), (21, 'Faskari'), (21, 'Funtua'), (21, 'Ingawa'), (21, 'Jibia'), (21, 'Kafur'), (21, 'Kaita'), (21, 'Kankara'), (21, 'Kankia'), (21, 'Katsina'), (21, 'Kurfi'), (21, 'Kusada'), (21, 'Mai Adua'), (21, 'Malumfashi'), (21, 'Mani'), (21, 'Mashi'), (21, 'Matazu'), (21, 'Musawa'), (21, 'Rimi'), (21, 'Sabuwa'), (21, 'Safana'), (21, 'Sandamu'), (21, 'Zango'), (22, 'Arewa Dandi'), (22, 'Argungu'), (22, 'Augie'), (22, 'Bagudo'), (22, 'Birnin Kebbi'), (22, 'Bunza'), (22, 'Dandi'), (22, 'Fakai'), (22, 'Gwandu'), (22, 'Jega'), (22, 'Kalgo'), (22, 'Koko/Besse'), (22, 'Maiyama'), (22, 'Ngaski'), (22, 'Sakaba'), (22, 'Shanga'), (22, 'Suru'), (22, 'Wasagu/Danko'), (22, 'Yauri'), (22, 'Zuru'), (23, 'Ajaokuta'), (23, 'Ankpa'), (23, 'Bassa'), (23, 'Dekina'), (23, 'Ibaji'), (23, 'Idah'), (23, 'Igalamela Odolu'), (23, 'Ijumu'), (23, 'Kabba/Bunu'), (23, 'Kogi'), (23, 'Lokoja'), (23, 'Mopa Muro'), (23, 'Ofu'), (23, 'Ogori/Magongo'), (23, 'Okehi'), (23, 'Okene'), (23, 'Olamaboro'), (23, 'Omala'), (23, 'Yagba East'), (23, 'Yagba West'), (24, 'Baruten'), (24, 'Edu'), (24, 'Ekiti'), (24, 'Ifelodun'), (24, 'Ilorin East'), (24, 'Ilorin South'), (24, 'Ilorin West'), (24, 'Irepodun'), (24, 'Isin'), (24, 'Kaiama'), (24, 'Moro'), (24, 'Offa'), (24, 'Oke Ero'), (24, 'Oyun'), (24, 'Pategi'), (25, 'Ajeromi-Ifelodun'), (25, 'Alimosho'), (25, 'Amuwo-Odofin'), (25, 'Apapa'), (25, 'Badagry'), (25, 'Epe'), (25, 'Eti Osa'), (25, 'Ibeju-Lekki'), (25, 'Ifako-Ijaiye'), (25, 'Ikeja'), (25, 'Ikorodu'), (25, 'Kosofe'), (25, 'Lagos Island'), (25, 'Lagos Mainland'), (25, 'Mushin'), (25, 'Ojo'), (25, 'Oshodi-Isolo'), (25, 'Shomolu'), (25, 'Surulere'), (26, 'Awe'), (26, 'Doma'), (26, 'Karu'), (26, 'Keana'), (26, 'Keffi'), (26, 'Kokona'), (26, 'Lafia'), (26, 'Nasarawa'), (26, 'Nasarawa Egon'), (26, 'Obi'), (26, 'Toto'), (26, 'Wamba'), (27, 'Agwara'), (27, 'Bida'), (27, 'Borgu'), (27, 'Bosso'), (27, 'Chanchaga'), (27, 'Edati'), (27, 'Gbako'), (27, 'Gurara'), (27, 'Katcha'), (27, 'Kontagora'), (27, 'Lapai'), (27, 'Lavun'), (27, 'Magama'), (27, 'Mariga'), (27, 'Mashegu'), (27, 'Mokwa'), (27, 'Moya'), (27, 'Paikoro'), (27, 'Rafi'), (27, 'Rijau'), (27, 'Shiroro'), (27, 'Suleja'), (27, 'Tafa'), (27, 'Wushishi'), (28, 'Abeokuta South'), (28, 'Ado-Odo/Ota'), (28, 'Egbado North'), (28, 'Egbado South'), (28, 'Ewekoro'), (28, 'Ifo'), (28, 'Ijebu East'), (28, 'Ijebu North'), (28, 'Ijebu North East'), (28, 'Ijebu Ode'), (28, 'Ikenne'), (28, 'Imeko Afon'), (28, 'Ipokia'), (28, 'Obafemi Owode'), (28, 'Odeda'), (28, 'Odogbolu'), (28, 'Ogun Waterside'), (28, 'Remo North'), (28, 'Shagamu'), (29, 'Akoko North-West'), (29, 'Akoko South-West'), (29, 'Akoko South-East'), (29, 'Akure North'), (29, 'Akure South'), (29, 'Ese Odo'), (29, 'Idanre'), (29, 'Ifedore'), (29, 'Ilaje'), (29, 'Ile Oluji/Okeigbo'), (29, 'Irele'), (29, 'Odigbo'), (29, 'Okitipupa'), (29, 'Ondo East'), (29, 'Ondo West'), (29, 'Ose'), (29, 'Owo'), (30, 'Atakunmosa West'), (30, 'Aiyedaade'), (30, 'Aiyedire'), (30, 'Boluwaduro'), (30, 'Boripe'), (30, 'Ede North'), (30, 'Ede South'), (30, 'Ife Central'), (30, 'Ife East'), (30, 'Ife North'), (30, 'Ife South'), (30, 'Egbedore'), (30, 'Ejigbo'), (30, 'Ifedayo'), (30, 'Ifelodun'), (30, 'Ila'), (30, 'Ilesa East'), (30, 'Ilesa West'), (30, 'Irepodun'), (30, 'Irewole'), (30, 'Isokan'), (30, 'Iwo'), (30, 'Obokun'), (30, 'Odo Otin'), (30, 'Ola Oluwa'), (30, 'Olorunda'), (30, 'Oriade'), (30, 'Orolu'), (30, 'Osogbo'), (31, 'Akinyele'), (31, 'Atiba'), (31, 'Atisbo'), (31, 'Egbeda'), (31, 'Ibadan North'), (31, 'Ibadan North-East'), (31, 'Ibadan North-West'), (31, 'Ibadan South-East'), (31, 'Ibadan South-West'), (31, 'Ibarapa Central'), (31, 'Ibarapa East'), (31, 'Ibarapa North'), (31, 'Ido'), (31, 'Irepo'), (31, 'Iseyin'), (31, 'Itesiwaju'), (31, 'Iwajowa'), (31, 'Kajola'), (31, 'Lagelu'), (31, 'Ogbomosho North'), (31, 'Ogbomosho South'), (31, 'Ogo Oluwa'), (31, 'Olorunsogo'), (31, 'Oluyole'), (31, 'Ona Ara'), (31, 'Orelope'), (31, 'Ori Ire'), (31, 'Oyo'), (31, 'Oyo East'), (31, 'Saki East'), (31, 'Saki West'), (31, 'Surulere'), (32, 'Barkin Ladi'), (32, 'Bassa'), (32, 'Jos East'), (32, 'Jos North'), (32, 'Jos South'), (32, 'Kanam'), (32, 'Kanke'), (32, 'Langtang South'), (32, 'Langtang North'), (32, 'Mangu'), (32, 'Mikang'), (32, 'Pankshin'), (32, 'Qua''an Pan'), (32, 'Riyom'), (32, 'Shendam'), (32, 'Wase'), (33, 'Ahoada East'), (33, 'Ahoada West'), (33, 'Akuku-Toru'), (33, 'Andoni'), (33, 'Asari-Toru'), (33, 'Bonny'), (33, 'Degema'), (33, 'Eleme'), (33, 'Emuoha'), (33, 'Etche'), (33, 'Gokana'), (33, 'Ikwerre'), (33, 'Khana'), (33, 'Obio/Akpor'), (33, 'Ogba/Egbema/Ndoni'), (33, 'Ogu/Bolo'), (33, 'Okrika'), (33, 'Omuma'), (33, 'Opobo/Nkoro'), (33, 'Oyigbo'), (33, 'Port Harcourt'), (33, 'Tai'), (34, 'Bodinga'), (34, 'Dange Shuni'), (34, 'Gada'), (34, 'Goronyo'), (34, 'Gudu'), (34, 'Gwadabawa'), (34, 'Illela'), (34, 'Isa'), (34, 'Kebbe'), (34, 'Kware'), (34, 'Rabah'), (34, 'Sabon Birni'), (34, 'Shagari'), (34, 'Silame'), (34, 'Sokoto North'), (34, 'Sokoto South'), (34, 'Tambuwal'), (34, 'Tangaza'), (34, 'Tureta'), (34, 'Wamako'), (34, 'Wurno'), (34, 'Yabo'), (35, 'Bali'), (35, 'Donga'), (35, 'Gashaka'), (35, 'Gassol'), (35, 'Ibi'), (35, 'Jalingo'), (35, 'Karim Lamido'), (35, 'Kumi'), (35, 'Lau'), (35, 'Sardauna'), (35, 'Takum'), (35, 'Ussa'), (35, 'Wukari'), (35, 'Yorro'), (35, 'Zing'), (36, 'Bursari'), (36, 'Damaturu'), (36, 'Fika'), (36, 'Fune'), (36, 'Geidam'), (36, 'Gujba'), (36, 'Gulani'), (36, 'Jakusko'), (36, 'Karasuwa'), (36, 'Machina'), (36, 'Nangere'), (36, 'Nguru'), (36, 'Potiskum'), (36, 'Tarmuwa'), (36, 'Yunusari'), (36, 'Yusufari'), (37, 'Bakura'), (37, 'Birnin Magaji/Kiyaw'), (37, 'Bukkuyum'), (37, 'Bungudu'), (37, 'Gummi'), (37, 'Gusau'), (37, 'Kaura Namoda'), (37, 'Maradun'), (37, 'Maru'), (37, 'Shinkafi'), (37, 'Talata Mafara'), (37, 'Chafe'), (37, 'Zurmi');"

					];


				for(let i = 0; i < queries.length ; i++){

						con.query(queries[i],(err,result)=>{

							if(!err){

									console.log('Database Table Migration ' + i + ' Done');

							}else{
								
								console.log(err);
							}
						});

				}

}
