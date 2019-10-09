import React, {Component} from "react";
import TextField from '@material-ui/core/TextField';
import localStorage from 'local-storage'
import Button from '@material-ui/core/Button';

class Berufstaetigkeit extends Component {

    constructor(props) {
        super(props);
        this.handleChangeBeruf = this.handleChangeBeruf.bind(this);
        this.handleNormalArbeitsfaehig = this.handleNormalArbeitsfaehig.bind(this);
        this.handleArbeitslos = this.handleArbeitslos.bind(this);
        this.handlePensioniert = this.handlePensioniert.bind(this);
        this.handleIVRente = this.handleIVRente.bind(this);
        this.handleArbeitsunfaehig = this.handleArbeitsunfaehig.bind(this);

        //Define the state of this component.
        this.state = {
            gelernterBeruf: '',
            aktuellerBeruf: '',

            normalArbeitsfaehig: false,
            arbeitlos: false,
            pensioniert: false,
            iVRente: false,
            arbeitsunfaehig: false
        };
        console.log("-  " + new Date().toLocaleTimeString() + " _Berufstätigkeiten_");
    }

    //write the Change of "aktueller Beruf" or "gelernter beruf" to the state.
    handleChangeBeruf = () => event => {
        this.setState({[event.target.name]: event.target.value}, () => {

            // completeness aller textfelder wird überprüft, sobald sich ein input ändert
            localStorage.set('BerufstaetigkeitKomplett', this.checkComponentCompleteness());
        });
    };

    //write the Change of the "normalArbeitsfaehig" Button to the state.
    handleNormalArbeitsfaehig = () => {
        this.setState({normalArbeitsfaehig: true}, () => {

            // da der Button "normalArbeitsfaehig" ausgewählt wurde, wir dieser auf true gesetzt. Alle anderen werden auf false gesetzt (sowohl im State als auch im Localstorage).
            localStorage.set('normalArbeitsfaehig', true);
            localStorage.set('arbeitlos', false);
            localStorage.set('pensioniert', false);
            localStorage.set('iVRente', false);
            localStorage.set('arbeitsunfaehig', false);
            this.setState({arbeitlos: false});
            this.setState({pensioniert: false});
            this.setState({iVRente: false});
            this.setState({arbeitsunfaehig: false});

            //nachdem alle "Arbeitszustände" geupdated sind, wird der Completeness-Check durchgeführt und in den localstorage geschrieben
            localStorage.set('BerufstaetigkeitKomplett', this.checkComponentCompleteness());
        });
    };


    //write the Change of the "arbeitlos" Button to the state.
    handleArbeitslos = () => {
        this.setState({arbeitlos: true}, () => {

            // da der Button "arbeitlos" ausgewählt wurde, wir dieser auf true gesetzt. Alle anderen werden auf false gesetzt (sowohl im State als auch im Localstorage).
            localStorage.set('normalArbeitsfaehig', false);
            localStorage.set('arbeitlos', true);
            localStorage.set('pensioniert', false);
            localStorage.set('iVRente', false);
            localStorage.set('arbeitsunfaehig', false);
            this.setState({normalArbeitsfaehig: false});
            this.setState({pensioniert: false});
            this.setState({iVRente: false});
            this.setState({arbeitsunfaehig: false});

            //nachdem alle "Arbeitszustände" geupdated sind, wird der Completeness-Check durchgeführt und in den localstorage geschrieben
            localStorage.set('BerufstaetigkeitKomplett', this.checkComponentCompleteness());
        });
    };


    //write the Change of the "pensioniert" Button to the state.
    handlePensioniert = () => {
        this.setState({pensioniert: true}, () => {

            // da der Button "pensioniert" ausgewählt wurde, wir dieser auf true gesetzt. Alle anderen werden auf false gesetzt (sowohl im State als auch im Localstorage).
            localStorage.set('normalArbeitsfaehig', false);
            localStorage.set('arbeitlos', false);
            localStorage.set('pensioniert', true);
            localStorage.set('iVRente', false);
            localStorage.set('arbeitsunfaehig', false);
            this.setState({normalArbeitsfaehig: false});
            this.setState({arbeitlos: false});
            this.setState({iVRente: false});
            this.setState({arbeitsunfaehig: false});

            //nachdem alle "Arbeitszustände" geupdated sind, wird der Completeness-Check durchgeführt und in den localstorage geschrieben
            localStorage.set('BerufstaetigkeitKomplett', this.checkComponentCompleteness());
        });
    };

    //write the Change of the "iVRente" Button to the state.
    handleIVRente = () => {
        this.setState({iVRente: true}, () => {

            // da der Button "iVRente" ausgewählt wurde, wir dieser auf true gesetzt. Alle anderen werden auf false gesetzt (sowohl im State als auch im Localstorage).
            localStorage.set('normalArbeitsfaehig', false);
            localStorage.set('arbeitlos', false);
            localStorage.set('pensioniert', false);
            localStorage.set('iVRente', true);
            localStorage.set('arbeitsunfaehig', false);
            this.setState({normalArbeitsfaehig: false});
            this.setState({arbeitlos: false});
            this.setState({pensioniert: false});
            this.setState({arbeitsunfaehig: false});

            //nachdem alle "Arbeitszustände" geupdated sind, wird der Completeness-Check durchgeführt und in den localstorage geschrieben
            localStorage.set('BerufstaetigkeitKomplett', this.checkComponentCompleteness());
        });
    };


    //write the Change of the "arbeitsunfaehig" Button to the state.
    handleArbeitsunfaehig = () => {
        this.setState({arbeitsunfaehig: true}, () => {

            // da der Button "arbeitsunfaehig" ausgewählt wurde, wir dieser auf true gesetzt. Alle anderen werden auf false gesetzt (sowohl im State als auch im Localstorage).
            localStorage.set('normalArbeitsfaehig', false);
            localStorage.set('arbeitlos', false);
            localStorage.set('pensioniert', false);
            localStorage.set('iVRente', false);
            localStorage.set('arbeitsunfaehig', true);
            this.setState({normalArbeitsfaehig: false});
            this.setState({arbeitlos: false});
            this.setState({pensioniert: false});
            this.setState({iVRente: false});

            //nachdem alle "Arbeitszustände" geupdated sind, wird der Completeness-Check durchgeführt und in den localstorage geschrieben
            localStorage.set('BerufstaetigkeitKomplett', this.checkComponentCompleteness());
        });
    };

    //Try to fetch the already inserted values from the localStorage
    componentDidMount() {
        this.setState({
            gelernterBeruf: localStorage.get('gelernterBeruf'),
            aktuellerBeruf: localStorage.get('aktuellerBeruf'),
            normalArbeitsfaehig: localStorage.get('normalArbeitsfaehig'),
            arbeitlos: localStorage.get('arbeitlos'),
            pensioniert: localStorage.get('pensioniert'),
            iVRente: localStorage.get('iVRente'),
            arbeitsunfaehig: localStorage.get('arbeitsunfaehig'),
        });
        localStorage.set('BerufstaetigkeitKomplett', this.checkComponentCompleteness());
    }

    // completeness der textfelder (aktueller resp. gelernter Beruf) und der Arbeitszustand-Buttons wird überprüft
    checkComponentCompleteness() {
        return (this.state.gelernterBeruf !== '' && this.state.aktuellerBeruf !== '' && this.state.gelernterBeruf !== null && this.state.aktuellerBeruf !== null && this.arbeitszustandGewaehltUndAusgefuellt());
    }

    //Diese Funktion prüft, ob einer der Arbeitszustands-Buttons ausgewählt ist
    arbeitszustandGewaehltUndAusgefuellt() {
        if (localStorage.get('normalArbeitsfaehig')) {
            // TODO: checken ob Arbeitspensum eingegeben wurde
            return true;
        } else if (localStorage.get('arbeitlos')) {
            // TODO: checken ob Zeitpunkt der Arbeitslosigkeit eingegeben wurde
            return true;
        } else if (localStorage.get('pensioniert')) {
            // TODO: checken ob Zeitpunkt der Pensionierung eingegeben wurde
            return true;
        } else if (localStorage.get('iVRente')) {
            // TODO: checken ob Zeitpunkt der IV-Rente eingegeben wurde
            return true;
        } else if (localStorage.get('arbeitsunfaehig')) {
            // TODO: checken ob Zeitpunkt der Arbeitsunfähigkeit eingegeben wurde
            return true;
        } else {
            // TODO: Find a way so that this alert is only executed, when needed (e.g. when "Zurück" / "Weiter" Button is clicked. Otherwise the alert pops up everytime anything changes on the page (Given that no Berufstätigkeit is selected yet).
            //alert("Achtung: Der Arbeitszustand wurde nicht ausgewählt")
            return false;
        }
    }

    //Write everything to the localState when the Component unmounts.
    componentWillUnmount() {
        localStorage.set('gelernterBeruf', this.state.gelernterBeruf);
        localStorage.set('aktuellerBeruf', this.state.aktuellerBeruf);
        localStorage.set('normalArbeitsfaehig', this.state.normalArbeitsfaehig);
        localStorage.set('arbeitlos', this.state.arbeitlos);
        localStorage.set('pensioniert', this.state.pensioniert);
        localStorage.set('iVRente', this.state.iVRente);
        localStorage.set('arbeitsunfaehig', this.state.arbeitsunfaehig);
        localStorage.set('BerufstaetigkeitKomplett', this.checkComponentCompleteness());
    }

    // zeigt "Arbeitspensum" Textbox nur an, wenn "normal arbeitsfähig" Button ausgewählt ist
    showNormalArbeitsfaehig() {
        if (this.state.normalArbeitsfaehig) {
            return (
                <div>
                    <p>Bitte geben Sie Ihr aktuelles Arbeitspensum an:</p>
                </div>)
            //TODO: Slider für Arbeitspensum erstellen
        }
    }

    // zeigt "Arbeitslos" Textbox nur an, wenn "arbeitslos" Button ausgewählt ist
    showArbeitslos() {
        if (this.state.arbeitlos) {
            return (
                <div>
                    <p>Bitte geben Sie an seit wann Sie arbeitslos sind:</p>
                </div>)
            //TODO: Auswahlmöglichkeit für Start der Arbeitslosigkeit erstellen
        }
    }

    // zeigt "Pensioniert" Textbox nur an, wenn "pensioniert" Button ausgewählt ist
    showPensioniert() {
        if (this.state.pensioniert) {
            return (
                <div>
                    <p>Bitte geben Sie an seit wann Sie pensioniert sind:</p>
                </div>)
            //TODO: Auswahlmöglichkeit für Start der Pensionierung erstellen
        }
    }

    // zeigt "IV Rente" Textbox nur an, wenn "IV Rente" Button ausgewählt ist
    showIVRente() {
        if (this.state.iVRente) {
            return (
                <div>
                    <p>Bitte geben Sie an seit wann Sie eine IV-Rente beziehen:</p>
                </div>)
            //TODO: Auswahlmöglichkeit für Start des IV-Renten-Bezugs erstellen
        }
    }

    // zeigt "Arbeitsunfähig" Textbox nur an, wenn "krankheitshalber arbeitsunfähig" Button ausgewählt ist
    showArbeitsunfaehig() {
        if (this.state.arbeitsunfaehig) {
            return (
                <div>
                    <p>Bitte geben Sie an seit wann Sie arbeitsunfaehig sind:</p>
                </div>)
            //TODO: Auswahlmöglichkeit für Start der Arbeitsunfähigkeit erstellen
        }
    }

    render() {
        // markiert den "normalArbeitsfaehig" button blau sobald dieser angewählt wurde
        const styleNormalArbeitsfaehig = (this.state.normalArbeitsfaehig) ? {background: '#BBC2E5'} : {};
        // markiert den "arbeitslos" button blau sobald dieser angewählt wurde
        const styleArbeitlos = (this.state.arbeitlos) ? {background: '#BBC2E5'} : {};
        // markiert den "pensioniert" button blau sobald dieser angewählt wurde
        const stylePensioniert = (this.state.pensioniert) ? {background: '#BBC2E5'} : {};
        // markiert den "iV-Rente" button blau sobald dieser angewählt wurde
        const styleIVRente = (this.state.iVRente) ? {background: '#BBC2E5'} : {};
        // markiert den "arbeitsunfaehig" button blau sobald dieser angewählt wurde
        const styleArbeitsunfaehig = (this.state.arbeitsunfaehig) ? {background: '#BBC2E5'} : {};

        return (
            <div>
                <div>

                    <TextField
                        label="Gelernter Beruf"
                        margin="normal"
                        variant="outlined"
                        name="gelernterBeruf"
                        value={this.state.gelernterBeruf}
                        onChange={this.handleChangeBeruf("gelernterBeruf")}
                        fullWidth
                        placeholder="Geben Sie hier Ihren gelernten Beruf ein"
                    />

                    <TextField
                        label="Aktueller Beruf"
                        margin="normal"
                        variant="outlined"
                        name="aktuellerBeruf"
                        value={this.state.aktuellerBeruf}
                        onChange={this.handleChangeBeruf("aktuellerBeruf")}
                        fullWidth
                        placeholder="Geben Sie hier Ihren aktuellen Beruf ein"
                    />

                </div>
                <div className="Berufstaetigkeit">
                    <div>Bitte wählen sie Ihren aktuellen Arbeitszustand:
                    </div>
                    <div className="BerufstaetigkeitButtonsLeft">
                        <Button variant="outlined" size="small" color="primary"
                                style={styleNormalArbeitsfaehig} onClick={this.handleNormalArbeitsfaehig}>normal
                            arbeitsfähig</Button>
                    </div>
                    <div className="BerufstaetigkeitButtonsLeft">
                        <Button variant="outlined" size="small" color="primary"
                                style={styleArbeitlos} onClick={this.handleArbeitslos}>arbeitslos</Button>
                    </div>
                    <div className="BerufstaetigkeitButtonsLeft">
                        <Button variant="outlined" size="small" color="primary"
                                style={stylePensioniert} onClick={this.handlePensioniert}>pensioniert</Button>
                    </div>
                    <div className="BerufstaetigkeitButtonsLeft">
                        <Button variant="outlined" size="small" color="primary"
                                style={styleIVRente} onClick={this.handleIVRente}>IV-Rente</Button>
                    </div>
                    <div className="BerufstaetigkeitButtonRight">
                        <Button variant="outlined" size="small" color="primary" style={styleArbeitsunfaehig}
                                onClick={this.handleArbeitsunfaehig}>
                            krankheits-halber
                            <br></br>arbeitsunfähig
                        </Button>
                    </div>
                </div>
                // Die folgenden DIVs werden nur angezeigt, wenn der entsprechende Button ausgewählt wurde
                <div>{this.showNormalArbeitsfaehig()}</div>
                <div>{this.showArbeitslos()}</div>
                <div>{this.showPensioniert()}</div>
                <div>{this.showIVRente()}</div>
                <div>{this.showArbeitsunfaehig()}</div>
            </div>
        );
    }
}

export default Berufstaetigkeit;