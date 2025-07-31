import * as React from 'react';
import ITemplateContext from '../../models/ITemplateContext';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { SkillCard } from '../SkillCard/SkillCard';
import styles from './SkillViewComponent.module.scss';
import { Text } from '@microsoft/sp-core-library';
import * as strings from "PeopleSearchWebPartStrings";

export interface ISkillViewProps {
    templateContext: ITemplateContext;
}

export interface ISkillViewState {
}

export class SkillViewComponent extends React.Component<ISkillViewProps, ISkillViewState> {

    public render(): JSX.Element {
        const ctx = this.props.templateContext;
        let mainElement: JSX.Element = null;
        let resultCountElement: JSX.Element = null;
        let paginationElement: JSX.Element = null;

        if (!isEmpty(ctx.items) && !isEmpty(ctx.items.value)) {
            if (ctx.showResultsCount) {
                resultCountElement = <div className={styles.resultCount}>
                        <label className="ms-fontWeight-semibold">{Text.format(strings.ResultsCount, ctx.resultCount)}</label>
                    </div>;
            }

            if (ctx.showPagination) {
                paginationElement = null;
            }

            const skillCards = [];
            for (let i = 0; i < ctx.items.value.length; i++) {
                skillCards.push(<div className={styles.skillCardItem} key={i}>
                    <div className={styles.skillCard}>
                        <SkillCard 
                            serviceScope={ctx.serviceScope} 
                            fieldsConfiguration={ctx.skillFields} 
                            item={ctx.items.value[i]} 
                            themeVariant={ctx.themeVariant} 
                        />
                    </div>
                </div>);
            }

            mainElement = <React.Fragment>
                <div className={styles.defaultCard}>
                    {resultCountElement}
                    <div className={styles.skillCardContainer}>
                        {skillCards}
                    </div>
                </div>
                {paginationElement}
            </React.Fragment>;
        }
        else if (!ctx.showBlank) {
            mainElement = <div className={styles.noResults}>{strings.NoResultMessage}</div>;
        }

        return <div className={styles.skillView}>{mainElement}</div>;
    }
}