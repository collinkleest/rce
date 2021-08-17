import Twilight from './Twilight.json';
import Dawn from './Dawn.json';
import Cobalt from './Cobalt.json';
import Sunburst from './Sunburst.json';
import NightOwl from './Night Owl.json';
import Monokai from './Monokai.json';
import Amy from './Amy.json';
import IDLE from './IDLE.json';

interface Theme {
    themeTitle: string;
    themeName: string;
    themeConfig: Object;
}

export const Themes : Theme[] = [
    {themeTitle: 'Twilight', themeName: 'twilight', themeConfig: Twilight},
    {themeTitle: 'Dawn', themeName: 'dawn', themeConfig: Dawn},
    {themeTitle: 'Cobalt', themeName: 'cobalt', themeConfig: Cobalt},
    {themeTitle: 'Sunburst', themeName: 'sunburst', themeConfig: Sunburst},
    {themeTitle: 'NightOwl', themeName: 'nightowl', themeConfig: NightOwl},
    {themeTitle: 'Monokai', themeName: 'monokai', themeConfig: Monokai},
    {themeTitle: 'Amy', themeName: 'amy', themeConfig: Amy},
    {themeTitle: 'IDLE', themeName: 'idle', themeConfig: IDLE}
]