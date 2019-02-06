import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import TopAppBar, {TopAppBarFixedAdjust} from '@material/react-top-app-bar';
import Drawer, {DrawerAppContent, DrawerContent, DrawerHeader, DrawerTitle} from '@material/react-drawer';
import List, {ListItem, ListItemGraphic, ListItemText} from '@material/react-list';
import Select from '@material/react-select';
import MaterialIcon from '@material/react-material-icon';

import './App.scss';

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            buildings: [],
            open: false,
            selectedBuilding: {},
            selectedIndex: 0
        }

    }

    componentDidMount = () => {
        fetch('pages.json')
            .then(r => r.json())
            .then(data =>{
                // map pages entries
                const buildings = data.map(entry =>
                    ({
                        label: entry.instance,
                        value: entry.instance.replace(/\s/g, "").toLowerCase(),
                        entries: entry.entries
                    })
                )

                console.log(buildings)

                this.setState ({
                    buildings: buildings,
                    open: false,
                    selectedBuilding: buildings[0],
                    selectedIndex: 0
                })

            })
    }

    logoImg = <img className="App-logo" src={process.env.PUBLIC_URL + '/logo.svg'} alt="Logo" />;

    // Drawer navigation
    navigateToIndex = (index) => {
        console.log(this.pgs)
        this.setState({open: false});
        this.setState({selectedIndex: index});
    }

    // Building navigation
    navigateBuilding = (selection) => {
        const v = selection.target.value;
        const b = this.state.buildings.find(e => e.value === v )

        // ensure selection fits index
        if(this.state.selectedIndex >= b.entries.length){
            this.setState({selectedIndex: 0});
        }
        this.setState({selectedBuilding: b}, () => this.navigateToIndex(this.state.selectedIndex) );
    }


    // Drawer List Elements
    entries = () => this.state.selectedBuilding.entries.map((entry, index) =>
        <ListItem key={index}>
            <ListItemGraphic graphic={<MaterialIcon icon={entry.icon}/>} />
            <ListItemText primaryText={entry.title} />
        </ListItem>
    )
    render() {
        const {buildings} = this.state
        return !buildings.length ? ("Loading"):(
            <div className="application">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Building Manager</title>
                    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"  />
                </Helmet>

                <div className='drawer-container'>
            <Drawer modal open={this.state.open} onClose={() => this.setState({open: false})}>
                <DrawerHeader>
                    {this.logoImg}
                    <DrawerTitle tag='h2'>
                        <Select
                            label='Building'
                            className='instance-select'
                            options={this.state.buildings}
                            onChange={this.navigateBuilding}
                            value={this.state.selectedBuilding.value}
                        >
                            </Select>
                        </DrawerTitle>
                    </DrawerHeader>

                    <DrawerContent>
                        <List singleSelection
                            selectedIndex={this.state.selectedIndex}
                            handleSelect={this.navigateToIndex}>
                            {this.entries()}
                        </List>
                    </DrawerContent>
                </Drawer>

                <DrawerAppContent className='drawer-app-content'>
                    <TopAppBar
                        title={this.state.selectedBuilding.entries[this.state.selectedIndex].title}
                        navigationIcon={<MaterialIcon
                            icon='menu'
                            onClick={() => this.setState({open: !this.state.open})}/>}
                        />

                            <TopAppBarFixedAdjust>
                                <iframe
                                    title="External App"
                                    src={this.state.selectedBuilding.entries[this.state.selectedIndex].url}
                                    style={{ width: 100+'%', height: 100+'%' }}>
                                </iframe>
                            </TopAppBarFixedAdjust>
                        </DrawerAppContent>
                    </div>
                </div>

                );
                }
                }

                export default App;
