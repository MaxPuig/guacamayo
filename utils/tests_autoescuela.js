const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs');
let tests = {};
let user_progress = {};


function start_test(msg, prefix) {
    if (msg.content.toLowerCase() == prefix+"test") {
        // enviar info y Hechos / Aprobados / Suspendidos / No hechos
        user_progress = JSON.parse(fs.readFileSync('./data/resultados.json', 'utf-8'));
        if (user_progress[msg.author.id] != undefined) {
            msg.channel.send({ content: 'Usa `'+prefix+'test` para ver info.\n`'+prefix+'test <numero 1-90>` para empezar ese test.', embeds: [user_progress[msg.author.id].progress()] })
        } else {
            msg.channel.send('Usa `'+prefix+'test` para ver info.\n`'+prefix+'test <numero 1-90>` para empezar ese test.\nHaz un test para ver tu progreso.')
        }
    } else if (msg.content.toLowerCase().startsWith(prefix+"test ")) {
        if (isNumeric(msg.content.toLowerCase().split(" ")[1]) && 1 <= msg.content.toLowerCase().split(" ")[1] <= 90) {
            let test = new test_class(Number(msg.content.toLowerCase().split(" ")[1]));
            msg.channel.send(test.newTest()).then(function (msg2) { test.message_id = msg2.id; });
            tests[msg.author.id] = test;
        } else {
            // enviar error
            msg.channel.send("Usa `"+prefix+"test` para ver info.\n`"+prefix+"test <numero>` para empezar ese test.")
        }
    }
}


async function test_continue(interaction) {
    if (tests[interaction.user.id] !== undefined) {
        if (interaction.message.id == tests[interaction.user.id].message_id) {
            if (interaction.customID == 'Siguiente') {
                // next
                await interaction.message.removeAttachments()
                let answer = await tests[interaction.user.id].siguiente(interaction.user.id);
                await interaction.editReply(answer);
            } else {
                // coregir
                if (tests[interaction.user.id].esperar_siguiente) return;
                let answer = tests[interaction.user.id].corregir(interaction.customID);
                await interaction.editReply(answer);
            }
            if (tests[interaction.user.id].acabado) {
                delete tests[interaction.user.id];
            }
        }
    }
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


class test_class {
    constructor(numero_test) {
        this.message_id = undefined;
        this.test = JSON.parse(fs.readFileSync('./data/tests.json', 'utf-8'))[numero_test - 1];
        this.numero_test = numero_test;
        this.pregunta = 0;
        this.correcta;
        this.explicacion;
        this.aprobado = 0;
        this.acabado = false;
        this.esperar_siguiente = false;
    }
    newTest() {
        this.correcta = this.test[this.pregunta].correcta;
        this.explicacion = this.test[this.pregunta].explicacion;
        let embed = new MessageEmbed()
            .setTitle(this.test[this.pregunta].pregunta)
            .setDescription(this.test[this.pregunta].a + '\n' + this.test[this.pregunta].b + '\n' + this.test[this.pregunta].c)
        const row = new MessageActionRow();
        const abc = ["a", "b", "c"];
        for (let x = 0; x < 3; x++) {
            row.addComponents(new MessageButton()
                .setCustomID(abc[x])
                .setLabel(abc[x])
                .setStyle('SECONDARY'));
        }
        if (this.test[this.pregunta].imagen) {
            embed.setImage(`attachment://${this.pregunta}.jpg`)
            return { embeds: [embed], files: [`./data/imagenes/${this.numero_test}/${this.pregunta}.jpg`], components: [row] };
        }
        return { embeds: [embed], components: [row] };
    }
    corregir(escogida) {
        this.esperar_siguiente = true;
        let embed = new MessageEmbed()
            .setTitle(this.test[this.pregunta].pregunta)
            .setDescription(this.test[this.pregunta].a + '\n' + this.test[this.pregunta].b + '\n' + this.test[this.pregunta].c);
        let explicacion1024 = this.explicacion.match(/.{1,1024}/g);
        for (let i = 0; i < Math.ceil(this.explicacion.length / 1024); i++) {
            embed.addFields({ name: 'Explicación', value: explicacion1024[i] })
        }
        let a_color = 'SECONDARY';
        let b_color = 'SECONDARY';
        let c_color = 'SECONDARY';
        if (this.correcta == "a") {
            a_color = 'SUCCESS';
        } else if (this.correcta == "b") {
            b_color = 'SUCCESS';
        } else if (this.correcta == "c") {
            c_color = 'SUCCESS';
        }
        if (this.correcta != escogida) {
            if (escogida == "a") {
                a_color = 'DANGER';
            } else if (escogida == "b") {
                b_color = 'DANGER';
            } else if (escogida == "c") {
                c_color = 'DANGER';
            }
        } else {
            this.aprobado++;
        }
        const row = new MessageActionRow();
        row.addComponents(new MessageButton()
            .setCustomID("a")
            .setLabel("a")
            .setStyle(a_color));
        row.addComponents(new MessageButton()
            .setCustomID("b")
            .setLabel("b")
            .setStyle(b_color));
        row.addComponents(new MessageButton()
            .setCustomID("c")
            .setLabel("c")
            .setStyle(c_color));
        row.addComponents(new MessageButton()
            .setCustomID("Siguiente")
            .setLabel("Siguiente")
            .setStyle('SECONDARY'));
        if (this.test[this.pregunta].imagen) {
            embed.setImage(`attachment://${this.pregunta}.jpg`)
            return { embeds: [embed], components: [row] };
        }
        return { embeds: [embed], components: [row] };
    }
    test_acabado(interaction_user_id) {
        if (user_progress[interaction_user_id] != undefined) {
            user_progress[interaction_user_id].newTestDone(this.numero_test, this.aprobado > 27, this.aprobado);
        } else {
            user_progress = JSON.parse(fs.readFileSync('./data/resultados.json', 'utf-8'));
            let progress = new progress_class(this.numero_test, this.aprobado > 27, this.aprobado);
            user_progress[interaction_user_id] = progress;
        }
        fs.writeFileSync('./data/resultados.json', JSON.stringify(user_progress));
    }
    siguiente(interaction_user_id) {
        this.esperar_siguiente = false;
        this.pregunta++;
        if (this.pregunta < 30) {
            return this.newTest();
        } else {
            this.acabado = true;
            this.test_acabado(interaction_user_id);
            return { embeds: [user_progress[interaction_user_id].progress()], components: []};
        }
    }
}


class progress_class {
    constructor(numero, aprobado, ultimo_test_correctas) {
        this.done = [];
        this.aprobados = [];
        this.suspendidos = [];
        this.not_done = Array.from({ length: 90 }, (_, i) => i + 1); // = [1,2,3,..,89,90]
        this.ultimo_test_correctas;
        this.ultimo_test_numero;
        this.newTestDone(numero, aprobado, ultimo_test_correctas);
    }
    newTestDone(numero, aprobado, ultimo_test_correctas) { //numero 1-90; aprobado: bool
        this.ultimo_test_correctas = ultimo_test_correctas;
        this.ultimo_test_numero = numero;
        this.done.push(numero);
        delete this.not_done[numero - 1];
        if (aprobado) {
            this.aprobados = [numero];
            if (this.suspendidos.includes(numero)) {
                const index = this.suspendidos.indexOf(numero);
                if (index > -1) {
                    this.suspendidos.splice(index, 1);
                }
            }
        } else {
            this.suspendidos.push(numero);
            if (this.aprobados.includes(numero)) {
                const index = this.aprobados.indexOf(numero);
                if (index > -1) {
                    this.aprobados.splice(index, 1);
                }
            }
        }
        this.done = [...new Set(this.done)]
        this.aprobados = [...new Set(this.aprobados)]
        this.suspendidos = [...new Set(this.suspendidos)]

        this.done.sort();
        this.aprobados.sort();
        this.suspendidos.sort();
    }

    progress() { //returns embed
        let hechos = "· ";
        for (let i = 0; i < this.done.length; i++) {
            hechos += this.done[i] + ", ";
        }
        if (hechos.length > 2) {
            hechos = hechos.slice(0, -2)
        }
        let aprobados = "· ";
        for (let i = 0; i < this.aprobados.length; i++) {
            aprobados += this.aprobados[i] + ", ";
        }
        if (aprobados.length > 2) {
            aprobados = aprobados.slice(0, -2)
        }
        let suspendidos = "· ";
        for (let i = 0; i < this.suspendidos.length; i++) {
            suspendidos += this.suspendidos[i] + ", ";
        }
        if (suspendidos.length > 2) {
            suspendidos = suspendidos.slice(0, -2)
        }
        let no_hechos = "· ";
        for (let i = 0; i < 90; i++) {
            if (this.not_done[i] != undefined) {
                no_hechos += this.not_done[i] + ", ";
            }
        }
        if (no_hechos.length > 2) {
            no_hechos = no_hechos.slice(0, -2)
        }
        let embed = new MessageEmbed()
            .setTitle('Tests Permiso B')
            .addFields(
                { name: 'Hechos', value: hechos },
                { name: 'Aprobados', value: aprobados },
                { name: 'Suspendidos', value: suspendidos },
                { name: 'No Hechos', value: no_hechos }
            )
            .setFooter('<prefijo>test <numero del 1 al 90>; Para empezar ese test');
        if (this.ultimo_test_correctas != undefined) {
            embed.addFields({ name: `Último Test: ${this.ultimo_test_numero}`, value: this.ultimo_test_correctas + '/30' })
        }
        return embed;
    }
}


module.exports = { start_test, test_continue };