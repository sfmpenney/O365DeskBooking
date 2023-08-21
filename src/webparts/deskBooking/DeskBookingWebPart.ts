import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'DeskBookingWebPartStrings';
import DeskBooking from './components/DeskBooking';
import { IDeskBookingProps } from './components/IDeskBookingProps';

export interface IDeskBookingWebPartProps {
  description: string;
  context: any;
  jobTitle: string;
  userDisplayName: string;
  Initials: string;
  ProfilePic: string;
}


export default class DeskBookingWebPart extends BaseClientSideWebPart<IDeskBookingWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IDeskBookingProps> = React.createElement(
      DeskBooking,
      {
        description: this.properties.description,
        context: this.context,
        jobTitle: "",
        userDisplayName: "",
        Initials: "",
        ProfilePic: "",
      }
    );

    ReactDom.render(element, this.domElement);
  }
  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
