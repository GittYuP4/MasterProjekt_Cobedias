import React, {Component} from 'react';
import {IFamilyExtNode} from 'relatives-tree';
import ReactFamilyTree from 'react-family-tree';
import FamilyNode from './FamilyNode';
import styles from './FamilyTree.module.css';
import Button from "@material-ui/core/Button";

import familyHelpers from "./FamilyData.js";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import localStorage from "local-storage";
import TextField from "@material-ui/core/TextField";


import {makeStyles} from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import Typography from "@material-ui/core/Typography";

import Fab from '@material-ui/core/Fab';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from "@material-ui/core/SvgIcon/SvgIcon";

import MenuItem from '@material-ui/core/MenuItem';

import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';


const TransitionAlertPopup = React.forwardRef(function TransitionAlertPopup(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});


//My ID is always 0.
const myID = 'me';

const WIDTH = 150;
const HEIGHT = 150;


const classes = makeStyles(theme => ({
    root: {
        width: "100%"
    },
    button: {
        marginRight: theme.spacing(1)
    },
    backButton: {
        marginRight: theme.spacing(1)
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    }
}));


const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: 200,
    },
}));

// creates all the year which can be chosen in the dropdowns "Geburtsjahr" / "Todesjahr"
const yearsDropdown = [];

for (var i = 2019; i >= 1919; i--) {
    const dict = {
        value: i,
    }
    yearsDropdown.push(dict);
}


// Namen der Stepps werden hier definiert
function getSteps(member) {
    if (verwandtschaftAbfragenNeeded(member)) {
        return ["Angaben", "Zustand", "Verwandtschaft"];
    } else {
        return ["Angaben", "Zustand"];
    }
}

//Function to determine if Verwandtschaft needs to be displayed for a current person.
function verwandtschaftAbfragenNeeded(member) {
    return !(member === 'myMother' || member === 'myFather' || member === 'addBrother' || member === 'addSister' || member.slice(0, 7) === 'sibling');
}


class FamilyTree extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handlePopupClose = this.handlePopupClose.bind(this);
        this.handleYesButtonChange = this.handleYesButtonChange.bind(this);
        this.handleNoButtonChange = this.handleNoButtonChange.bind(this);


        //Define the state of this component.
        this.state = {
            FamilyDataState: familyHelpers.getFamilyData(),
            popupOpen: false,
            popupCancelAlertOpen: false,
            popupDeleteFamilyMemberAlertOpen: false,
            familyMemberToBeDeleted: 'false',
            popupKomplett: false,
            angabenKomplett: false,
            familyMemberZustandKomplett: false,
            verwandschaftKomplett: false,
            familyMember: '',
            geburtsjahr: 0,
            spitzname: '',
            vorname: '',
            nachname: '',
            gesundheitszustand: '',
            currentSelectedFamilyMember: '',
            activeStep: 0,
            completed: {},
            verstorben: '',
            todesjahr: 0,
            todesursache: ''
        };

        console.log("Starting Family Data: \n" + JSON.stringify(familyHelpers.getFamilyData()));
    }

// zeigt Component des jeweiligen Stepps und ermöglicht so navigation zu einem spezifischen Stepp
    getStepContent(step) {
        switch (step) {
            case 0:
                return this.showAngaben();
            case 1:
                return this.showFamilyMemberZustand();
            case 2:
                return this.showVerwandtschaft();
            default:
                return "Unknown step";
        }
    }


// prüft ob ein spezifischer Component "complete" ist
    componentCompleted(step) {
        switch (step) {
            case 0:
                console.log("-  " + new Date().toLocaleTimeString() + " _Popup_Angaben_ Fertig");
                return (this.state.angabenKomplett);
            case 1:
                console.log("-  " + new Date().toLocaleTimeString() + " _Popup_Zustand_ Fertig");
                return this.state.familyMemberZustandKomplett;
            case 2:
                console.log("-  " + new Date().toLocaleTimeString() + " _Popup_Zustand_ Fertig");
                return this.state.verwandschaftKomplett;
            default:
                console.log("case default");
                return false;
        }
    }

// prüft, ob alle Felder in diesem Step ausgefüllt sind
    updateStepCompleteness(step) {
        this.setState({
            angabenKomplett: this.checkAngabenCompleteness(),
            familyMemberZustandKomplett: this.checkZustandCompleteness(),
            verwandschaftKomplett: this.checkVerwandschaftCompleteness()
        }, () => {
            console.log("check completeness for: " + step);
            // alle ausgefüllt --> Häckchen wird gesetzt
            if (this.componentCompleted(step) === true) {
                const newCompleted = this.state.completed;
                newCompleted[step] = true;
                this.setState({completed: newCompleted});
                // setCompleted(newCompleted);
            } else {
                // Nicht alle ausgefüllt --> Häckchen wird entfernt
                const newCompleted = this.state.completed;
                newCompleted[step] = false;
                this.setState({completed: newCompleted});
                // TODO: Enable alert (evtl. mit zwei Buttons --> möchten Sie wirklich weiter? Ja/Nein)
                // TODO: Alert-Vorgehen überdenken: nur einfacher Alert oder unterschiedlicher Alert für jeden Case?
                // TODO: Sollen nicht ausgefüllte textfelder rot markiert werden?
                //alert("Nicht alle Felder ausgefüllt!");
            }
        })
    }


    // "Weiter" Button
    handleNext = (e) => {
        this.updateStepCompleteness(this.state.activeStep);
        if (this.state.activeStep === getSteps(this.state.currentSelectedFamilyMember).length - 1) {
            this.handlePopupClose(e);
        } else {
            this.setState({activeStep: this.state.activeStep + 1});
        }
    };

    // "Zurück" Button
    handleBack = (e) => {
        this.updateStepCompleteness(this.state.activeStep);
        if (this.state.activeStep === 0) {
            this.handlePopopCancelAlert(e);
        } else {
            this.setState({activeStep: this.state.activeStep - 1});
        }
    };

    // Direkter Sprung zu einem Stepp in oberer Leiste (Stepp Button)
    handleStep = step => () => {
        this.updateStepCompleteness(this.state.activeStep);
        this.setState({activeStep: step});
    };

    //OnClick function ot add Siblings of me
    //write the Change of "vorname" / "nachname" and so on to the state.
    handleChange = () => event => {
        this.setState({
            [event.target.name]: event.target.value
        }, () => {
            this.updateStepCompleteness(this.state.activeStep);
        });
    };


    //write the Change of "todesjahr" and so on to the state.
    handleChangeTodesjahr = () => event => {
        this.setState({todesjahr: event.target.value}, () => {
            this.updateStepCompleteness(this.state.activeStep);
        });
    };

    //write the Change of "geburtsjahr" and so on to the state.
    handleChangeGeburtsjahr = () => event => {
        this.setState({
            geburtsjahr: event.target.value,
        }, () => {
            this.updateStepCompleteness(this.state.activeStep);
        })
        ;
    };


    // closes Popup when new family member is added with button "hinzufügen"
    handlePopupClose = e => {

        //First try to add a new Member if the value starts with add, else a current member needs to be edited.
        if (e.currentTarget.value === 'addDaughter') {
            this.addChildren('addDaughter');
        } else if (e.currentTarget.value === 'addSon') {
            this.addChildren('addSon');
        } else if (e.currentTarget.value === 'addSpouse') {
            this.addSpouse('addSpouse');
        } else if (e.currentTarget.value === 'addBrother') {
            this.addSibling('addBrother');
        } else if (e.currentTarget.value === 'addSister') {
            this.addSibling('addSister')
        } else {
            console.log("__Handle Popup Close for: " + e.currentTarget.value + " --> Edit of data");
            let currentData = familyHelpers.getFamilyMemberByID(this.state.currentSelectedFamilyMember);
            familyHelpers.editExistingFamilyMember(currentData.id, currentData.gender, currentData.parents, currentData.siblings, currentData.spouses, currentData.children, this.state.geburtsjahr, this.state.spitzname, this.state.vorname, this.state.nachname, this.state.verstorben, this.state.todesjahr, this.state.todesursache, this.state.gesundheitszustand);
        }

        this.setState({
            popupOpen: false,
            geburtsjahr: 0,
            spitzname: '',
            vorname: '',
            nachname: '',
            gesundheitszustand: '',
            activeStep: 0,
            verstorben: '',
            todesjahr: 0,
            todesursache: '',
            popupKomplett: false,
            angabenKomplett: false,
            familyMemberZustandKomplett: false,
            verwandschaftKomplett: false
        });
    };

    // when the "addFamilyMember-Popup" is closed (with "abbrechen" or "x") this handler closes the popup (without deleting the data) and opens the alert popup
    handlePopopCancelAlert = e => {
        this.setState({
            popupCancelAlertOpen: true,
            popupOpen: false
        })
    }

    // closes "addFamilyMember-Popup" when adding new family member is canceled with button "abbrechen" && then alert popup is agreed
    // the unsaved data is deleted
    handlePopupCancel = e => {
        this.setState({
            popupCancelAlertOpen: false,
            popupOpen: false,
            geburtsjahr: 0,
            spitzname: '',
            vorname: '',
            nachname: '',
            gesundheitszustand: '',
            activeStep: 0,
            verstorben: '',
            todesjahr: 0,
            todesursache: '',
            popupKomplett: false,
            angabenKomplett: false,
            familyMemberZustandKomplett: false,
            verwandschaftKomplett: false
        });
    };

    // closes alert Popup when alert message is not agreed --> the data is not deleted and the "addFamilyMember-Popup" is opened again
    handlePopupCancelAlertClose = e => {
        this.setState({
            popupOpen: true,
            popupCancelAlertOpen: false
        });
    };

    // closes alert Popup when alert message is not agreed / family member is not deleted!
    handlePopupDeleteFamilyMemberAlertClose = e => {
        this.setState({
            popupDeleteFamilyMemberAlertOpen: false,
            familyMemberToBeDeleted: ''
        });
    };


    //write the Change of the Verstorben=Yes Button to the state.
    handleYesButtonChange = () => {
        this.setState({
            verstorben: true,
        }, () => {
            this.updateStepCompleteness(this.state.activeStep);
        });
    };


    //write the Change of the Verstorben=No Button to the state.
    handleNoButtonChange = () => {
        this.setState({
            verstorben: false,
        }, () => {
            this.updateStepCompleteness(this.state.activeStep);
        });
    };

    // Completeness der Textfelder im step Angaben wird überprüft
    checkAngabenCompleteness() {
        if (this.state.geburtsjahr !== 0 && this.state.spitzname !== '' && this.state.vorname !== '' && this.state.nachname !== '') {
            return true;
        } else {
            return false;
        }
    }

    // Completeness der Textfelder im step Zustand wird überprüft
    checkZustandCompleteness() {
        if (this.state.verstorben === '') {
            return false;
        } else if (this.state.verstorben === true) {
            if (this.state.todesjahr !== 0 && this.state.todesjahr !== '' && this.state.todesursache !== '') {
                return true;
            } else {
                return false;
            }
        } else if (this.state.verstorben === false) {
            if (this.state.gesundheitszustand !== '') {
                return true;
            }
        } else {
            return false;
        }
    }

    //TODO: check if the necessaryfields are filled out in the step "Verwandschaft"
    // Completeness der Textfelder im step Verwandschaft wird überprüft
    checkVerwandschaftCompleteness() {
        return true;
    }

    //OnClick function ot add Siblings of me
    addSibling = (e) => {
        let me = familyHelpers.getFamilyMemberByID("me");

        //Take me as Sibling
        let siblings = [
            {
                "id": "me",
                "type": "blood"
            },
        ];

        //Add other siblings I have
        for (let i = 0; i < me.siblings.length; i++) {
            siblings.push(me.siblings[i]);
        }

        //Change between add sister or add brother.
        if (e === 'addSister') {
            familyHelpers.addFamilyMember("sibling" + familyHelpers.getHighestIndexOfSiblings(), "female", me.parents, siblings, [], [], this.state.geburtsjahr, this.state.spitzname, this.state.vorname, this.state.nachname, this.state.verstorben, this.state.todesjahr, this.state.todesursache, this.state.gesundheitszustand);
        } else {
            familyHelpers.addFamilyMember("sibling" + familyHelpers.getHighestIndexOfSiblings(), "male", me.parents, siblings, [], [], this.state.geburtsjahr, this.state.spitzname, this.state.vorname, this.state.nachname, this.state.verstorben, this.state.todesjahr, this.state.todesursache, this.state.gesundheitszustand);
        }

        this.setState(
            {FamilyDataState: familyHelpers.getFamilyData()}
        )
    };

    //OnClick Function to add a Spouse
    addSpouse = (e) => {
        let me = familyHelpers.getFamilyMemberByID("me");

        if (me.gender === 'female') {
            familyHelpers.addFamilyMember("spouse" + familyHelpers.getHighestIndexOfSpouse(), "male", [], [], [{
                "id": "me",
                "type": "married"
            }], me.children, this.state.geburtsjahr, this.state.spitzname, this.state.vorname, this.state.nachname, this.state.verstorben, this.state.todesjahr, this.state.todesursache, this.state.gesundheitszustand);
        } else {
            familyHelpers.addFamilyMember("spouse" + familyHelpers.getHighestIndexOfSpouse(), "female", [], [], [{
                "id": "me",
                "type": "married"
            }], me.children, this.state.geburtsjahr, this.state.spitzname, this.state.vorname, this.state.nachname, this.state.verstorben, this.state.todesjahr, this.state.todesursache, this.state.gesundheitszustand);
        }

        this.setState(
            {FamilyDataState: familyHelpers.getFamilyData()}
        )
    };

    //OnClick Function to add Children
    addChildren = (e) => {
        let me = familyHelpers.getFamilyMemberByID("me");
        let meChildren = [];
        let meAsAParent = [
            {
                "id": "me",
                "type": "blood"
            }
        ];

        //TODO: Add a selection from which Spouse the child is and then push it to the meAsAParent Array.
        if (me.spouses.length === 1) {
            meAsAParent.push(me.spouses)
        }

        if (me.children !== [] && me.children.length !== 0) {
            for (let i = 0; i < me.children.length; i++) {
                meChildren.push(me.children[i]);
            }
        }

        if (e === 'addDaughter') {
            familyHelpers.addFamilyMember("child" + familyHelpers.getHighestIndexOfChildren(), "female", meAsAParent, meChildren, [], [], this.state.geburtsjahr, this.state.spitzname, this.state.vorname, this.state.nachname, this.state.verstorben, this.state.todesjahr, this.state.todesursache, this.state.gesundheitszustand);
        } else {
            familyHelpers.addFamilyMember("child" + familyHelpers.getHighestIndexOfChildren(), "male", meAsAParent, meChildren, [], [], this.state.geburtsjahr, this.state.spitzname, this.state.vorname, this.state.nachname, this.state.verstorben, this.state.todesjahr, this.state.todesursache, this.state.gesundheitszustand);
        }

        this.setState(
            {FamilyDataState: familyHelpers.getFamilyData()}
        )
    };


    //onclick Function to open alert popup which asks if you really want to delete this family member
    handleDeleteFamilyMemberPopup = (e) => {
        console.log("Delete FamiliyMember POPUP --> " + e);

        this.setState(
            {
                popupDeleteFamilyMemberAlertOpen: true,
                familyMemberToBeDeleted: e
            }
        )
    };

    //onclick Function to delete Family Member: called when alert popup to delete family member is agreed
    deleteFamilyMember = (e) => {
        console.log("Delete FamiliyMember --> " + this.state.familyMemberToBeDeleted);

        familyHelpers.deleteFamilyMember(this.state.familyMemberToBeDeleted);

        this.setState(
            {
                popupDeleteFamilyMemberAlertOpen: false,
                FamilyDataState: familyHelpers.getFamilyData(),
                familyMemberToBeDeleted: ''
            }
        )
    };

    //edit of already existing Family members
    editFamilyMember = (e) => {
        console.log("Edit Familiy Member --> " + e);

        this.setState({
            geburtsjahr: familyHelpers.getFamilyMemberByID(e).geburtsjahr,
            spitzname: familyHelpers.getFamilyMemberByID(e).spitzname,
            vorname: familyHelpers.getFamilyMemberByID(e).vorname,
            nachname: familyHelpers.getFamilyMemberByID(e).nachname,
            verstorben: familyHelpers.getFamilyMemberByID(e).verstorben,
            todesjahr: familyHelpers.getFamilyMemberByID(e).todesjahr,
            todesursache: familyHelpers.getFamilyMemberByID(e).todesursache,
            gesundheitszustand: familyHelpers.getFamilyMemberByID(e).gesundheitszustand
        });

        //Open Popup
        this.popUpFamilyMember(e);
    };

    //TODO: Write Family Data into local Storage such that a refresh will not loose all data.

    // popup to add a new family member
    popUpFamilyMember = (fm) => {
        console.log("__PopUp for Family Member: " + fm);
        this.setState({popupOpen: true, currentSelectedFamilyMember: fm}, () => {
            this.updateStepCompleteness(0);
            this.updateStepCompleteness(1);
            this.updateStepCompleteness(2);
        });
    };

    //Show Popup,if state == true
    showPopup() {
        return (
            <div>
                <Dialog open={this.state.popupOpen}>
                    <div className="dialogContentDiv">
                        <DialogTitle>Bitte füllen Sie aus:</DialogTitle>
                        <DialogContent style={{padding: '0'}}>
                            <div>{this.showStepperInPopup()}</div>
                        </DialogContent>
                    </div>
                </Dialog>
            </div>)
    }

    //Show Popup,if state == true
    showPopupCancelAlert() {
        return (
            <div>
                <Dialog
                    open={this.state.popupCancelAlertOpen}
                    TransitionComponent={TransitionAlertPopup}
                    keepMounted
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">{"Wollen Sie wirklich abbrechen?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Wenn Sie abbrechen, werden Ihre Daten nicht gespeichert!
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handlePopupCancelAlertClose} color="primary">
                            Nein
                        </Button>
                        <Button onClick={this.handlePopupCancel} color="primary">
                            Ja
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>)
    }

    // step content of "Angaben"
    showAngaben() {
        return (
            <div>
                <form className={useStyles.container} noValidate autoComplete="off">
                    <TextField
                        id="geburtsjahr"
                        select
                        label="Geburtsjahr"
                        className={classes.textField}
                        value={this.state.geburtsjahr}
                        onChange={this.handleChangeGeburtsjahr("geburtsjahr")}
                        SelectProps={{
                            MenuProps: {
                                className: classes.menu,
                            },
                        }}
                        helperText="Geburtsjahr wählen"
                        margin="normal"
                    >
                        {yearsDropdown.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.value}
                            </MenuItem>
                        ))}
                    </TextField>
                </form>
                <TextField
                    label="Spitzname"
                    margin="normal"
                    variant="outlined"
                    name="spitzname"
                    value={this.state.spitzname}
                    onChange={this.handleChange("spitzname")}
                    fullWidth
                    placeholder="Geben Sie hier den Spitznamen ein"
                />
                <TextField
                    label="Vorname"
                    margin="normal"
                    variant="outlined"
                    name="vorname"
                    value={this.state.vorname}
                    onChange={this.handleChange("vorname")}
                    fullWidth
                    placeholder="Geben Sie hier den Vornamen ein"
                />
                <TextField
                    label="Nachname"
                    margin="normal"
                    variant="outlined"
                    name="nachname"
                    value={this.state.nachname}
                    onChange={this.handleChange("nachname")}
                    fullWidth
                    placeholder="Geben Sie hier den Nachnamen ein"
                />
            </div>
        )
    }


    //Show Popup,if state == true
    showPopupDeleteFamilyMemberAlert() {
        return (
            <div>
                <Dialog
                    open={this.state.popupDeleteFamilyMemberAlertOpen}
                    TransitionComponent={TransitionAlertPopup}
                    keepMounted
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle
                        id="alert-dialog-slide-title">{"Wollen Sie dieses Familienmitglieder wirklich löschen?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Wählen Sie "Ja", um das Familienmitglied zu löschen. Achtung, diese Aktion kann nicht
                            rückgängig gemacht werden.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handlePopupDeleteFamilyMemberAlertClose} color="primary">
                            Nein
                        </Button>
                        <Button onClick={this.deleteFamilyMember} color="primary">
                            Ja
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>)
    }


    // markiert den "Ja" button blau sobald er angewählt wird
    colorYesButton() {
        if (this.state.verstorben === '') {
            return false
        } else {
            return (this.state.verstorben)
        }
    }

    // markiert den "Nein" button blau sobald er angewählt wird
    colorNoButton() {
        if (this.state.verstorben === '') {
            return false
        } else {
            return (!this.state.verstorben)
        }
    }

    // step content of "Zustand"
    showFamilyMemberZustand() {
        const styleYesButton = (this.colorYesButton()) ? {background: '#BBC2E5'} : {};
        const styleNoButton = (this.colorNoButton()) ? {background: '#BBC2E5'} : {};

        return (

            <div>
                <p>Familienmitglieder verstorben?</p>
                <div className="FamilyMemberZustandButton">
                    <Button variant="outlined" size="small" color="primary"
                            style={styleYesButton} onClick={this.handleYesButtonChange}> Ja </Button>
                </div>
                <div className="FamilyMemberZustandButton">
                    <Button variant="outlined" size="small" color="primary" style={styleNoButton}
                            onClick={this.handleNoButtonChange}> Nein </Button>
                </div>
                <div>{this.showGesundheitszustandOrTodesjahr()}</div>
            </div>
        )
    }

    // depending on if verstorben=YES/NO this function displays the apropriate stepper content
    showGesundheitszustandOrTodesjahr() {
        if (this.state.verstorben !== '') {
            if (this.state.verstorben) {
                return (
                    <div>
                        <br/>
                        <br/>
                        <br/>
                        <p>Bitte geben Sie das Todesjahr und die Todesursache an:</p>
                        <form className={useStyles.container} noValidate autoComplete="off">
                            <TextField
                                id="todesjahr"
                                select
                                label="Todesjahr"
                                className={classes.textField}
                                value={this.state.todesjahr}
                                onChange={this.handleChangeTodesjahr("todesjahr")}
                                SelectProps={{
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}
                                helperText="Todesjahr wählen"
                                margin="normal"
                            >
                                {yearsDropdown.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.value}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </form>

                        <TextField
                            style={{width: '100px', margin: '3px'}}
                            label="Todesjahr"
                            margin="normal"
                            variant="outlined"
                            name="todesjahr"
                            value={this.state.todesjahr}
                            onChange={this.handleChange("todesjahr")}
                            fullWidth
                            placeholder="Todesjahr"
                        />
                        <TextField
                            label="Todesursache"
                            margin="normal"
                            variant="outlined"
                            name="todesursache"
                            value={this.state.todesursache}
                            onChange={this.handleChange("todesursache")}
                            fullWidth
                            multiline
                            rows="8"
                            placeholder="Geben Sie hier die Todesursache ein"
                        />
                    </div>
                )

            } else {
                return (
                    <div>
                        <br/>
                        <br/>
                        <br/>
                        <div className="Gesundheitszustand">
                            <p>Bitte geben Sie den Gesundheitszustand an:</p>
                        </div>
                        <TextField
                            label="Gesundheitszustand"
                            margin="normal"
                            variant="outlined"
                            name="gesundheitszustand"
                            value={this.state.gesundheitszustand}
                            onChange={this.handleChange("gesundheitszustand")}
                            fullWidth
                            multiline
                            rows="8"
                            placeholder="Geben Sie hier den Gesundheitszustand ein"
                        />
                    </div>
                )
            }
        }
    }

    // stepper content of "Verwandschaft"
    showVerwandtschaft() {
        return (
            <div>
                <p>Here you can enter your Verwandtschaft</p>
            </div>
        )
    }

    showStepperInPopup() {
        return (
            <div className='FamilyTreeContent'>
                <div>
                    <Button color="primary" aria-label="edit"
                            onClick={this.handlePopopCancelAlert}
                            value={this.state.currentSelectedFamilyMember}
                            style={{
                                margin: '0 auto',
                                height: '60px',
                                width: '30px',
                                position: 'absolute',
                                top: '0%',
                                right: '0%',
                                background: 'red',
                                color: 'white',
                                borderRadius: '0 0 0 10px',
                            }}>
                        <CancelIcon style={{
                            position: 'absolute',
                            margin: '0 auto',
                            height: '30px',
                            width: '30px',
                        }}/>
                    </Button>
                </div>
                <Stepper alternativeLabel nonLinear activeStep={this.state.activeStep}>
                    {getSteps(this.state.currentSelectedFamilyMember).map((label, index) => {
                        const stepProps = {};
                        return (
                            <Step key={label} {...stepProps}>
                                <StepButton
                                    onClick={this.handleStep(index)} completed={this.state.completed[index]}>
                                    {label}
                                </StepButton>
                            </Step>
                        );
                    })}
                </Stepper>
                <div>
                    <div className="FamilyTreeStepContent">
                        <Typography className={classes.instructions}>
                            {this.getStepContent(this.state.activeStep)}
                        </Typography>
                    </div>
                    <div className="FamilyTreeNavigationsButton">
                        <Button
                            size="large"
                            variant="outlined"
                            onClick={this.handleBack}
                            value={this.state.currentSelectedFamilyMember}
                            className={classes.button}
                            style={{width: '100px', margin: '3px'}}
                        >
                            {this.state.activeStep === 0 ? 'Abbrechen' : 'Zurück'}
                        </Button>
                        <Button
                            size="large"
                            variant="contained"
                            color="primary"
                            onClick={this.handleNext}
                            value={this.state.currentSelectedFamilyMember}
                            className={classes.button}
                            style={{width: '100px', margin: '3px'}}
                        >
                            {this.state.activeStep === getSteps(this.state.currentSelectedFamilyMember).length - 1 ? 'Fertig' : 'Weiter'}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div style={{margin: '0 auto'}}>
                <div>
                    <Button id="addSister" variant="outlined" color="primary"
                            onClick={() => this.popUpFamilyMember('addSister')}>Schwester
                        Hinzufügen</Button>
                    <Button id="addBrother" variant="outlined" color="primary"
                            onClick={() => this.popUpFamilyMember('addBrother')}>Bruder
                        Hinzufügen</Button>
                    <Button id="addSpouse" variant="outlined" color="primary"
                            onClick={() => this.popUpFamilyMember('addSpouse')}>Partner
                        Hinzufügen</Button>
                    <Button id="addDaughter" variant="outlined" color="primary"
                            onClick={() => this.popUpFamilyMember('addDaughter')}>Tochter
                        Hinzufügen</Button>
                    <Button id="addSon" variant="outlined" color="primary"
                            onClick={() => this.popUpFamilyMember('addSon')}>Sohn
                        Hinzufügen</Button>
                    <div>{this.showPopup()}</div>
                    <div>{this.showPopupCancelAlert()}</div>
                    <div>{this.showPopupDeleteFamilyMemberAlert()}</div>
                </div>
                <div>
                    <ReactFamilyTree
                        nodes={this.state.FamilyDataState}
                        rootId={myID}
                        width={WIDTH}
                        height={HEIGHT}
                        canvasClassName={styles.tree}
                        renderNode={(node: IFamilyExtNode) => (
                            <FamilyNode
                                key={node.id}
                                node={node}
                                isRoot={node.id === myID}
                                deleteFunction={this.handleDeleteFamilyMemberPopup}
                                editFunction={this.editFamilyMember}
                                style={{
                                    width: WIDTH * 0.8,
                                    height: HEIGHT * 0.8,
                                    transform: `translate(${node.left * (WIDTH / 1.9)}px, ${node.top * (HEIGHT / 1.9)}px)`,
                                }}
                            />
                        )}
                    />
                </div>
            </div>
        );
    }
}

export default FamilyTree;