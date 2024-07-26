module.exports = (sequelize, Sequelize) => {
    const Evaluation = sequelize.define("Evaluation", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        eventId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'events',
                key: 'id'
            },
            allowNull: false,
        },
        // Espresso
        espresso_flush_head1: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        espresso_flush_head2: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        espresso_flush_head_dsgn: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        espresso_dry_filter1: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        espresso_dry_filter2: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        espresso_dry_filter_dsgn: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        espresso_spill1: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        espresso_spill2: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        espresso_spill_dsgn: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        espresso_dosing1: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        espresso_dosing2: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        espresso_dosing_dsgn: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        espresso_clean_port1: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        espresso_clean_port2: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        espresso_clean_port_dsgn: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        espresso_brew1: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        espresso_brew2: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        espresso_brew_dsgn: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        espresso_extract_time1: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        espresso_extract_time2: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        espresso_extract_time_dsgn: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        espresso_total1: {
            type: Sequelize.INTEGER,
        },
        espresso_total2: {
            type: Sequelize.INTEGER,
        },
        espresso_total_dsgn: {
            type: Sequelize.INTEGER,
        },
        // Milk
        milk_clean_pitcher1: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        milk_clean_pitcher2: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        milk_clean_pitcher_dsgn: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        milk_purge_wand_before1: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        milk_purge_wand_before2: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        milk_purge_wand_before_dsgn: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        milk_clean_wand1: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        milk_clean_wand2: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        milk_clean_wand_dsgn: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        milk_purge_wand_after1: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        milk_purge_wand_after2: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        milk_purge_wand_after_dsgn: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        milk_total1: {
            type: Sequelize.INTEGER,
        },
        milk_total2: {
            type: Sequelize.INTEGER,
        },
        milk_total_dsgn: {
            type: Sequelize.INTEGER,
        },
        // Hygiene
        hygiene_clean_wand: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        hygiene_total: {
            type: Sequelize.INTEGER,
        },
        // Performance
        performance_org_workspace: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        performance_overall: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        performance_total: {
            type: Sequelize.INTEGER,
        },
        // Total score
        total_score: {
            type: Sequelize.INTEGER,
        },
    });
    return Evaluation;
};