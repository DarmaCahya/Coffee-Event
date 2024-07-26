const db = require("../models");
const Score = db.score;
const Op = db.Sequelize.Op;

exports.createScore = async (req, res) => {
    try {
        const {
            eventId,
            espresso_flush_head1,
            espresso_flush_head2,
            espresso_flush_head_dsgn,
            espresso_dry_filter1,
            espresso_dry_filter2,
            espresso_dry_filter_dsgn,
            espresso_spill1,
            espresso_spill2,
            espresso_spill_dsgn,
            espresso_dosing1,
            espresso_dosing2,
            espresso_dosing_dsgn,
            espresso_clean_port1,
            espresso_clean_port2,
            espresso_clean_port_dsgn,
            espresso_brew1,
            espresso_brew2,
            espresso_brew_dsgn,
            espresso_extract_time1,
            espresso_extract_time2,
            espresso_extract_time_dsgn,
            espresso_total1,
            espresso_total2,
            espresso_total_dsgn,
            milk_clean_pitcher1,
            milk_clean_pitcher2,
            milk_clean_pitcher_dsgn,
            milk_purge_wand_before1,
            milk_purge_wand_before2,
            milk_purge_wand_before_dsgn,
            milk_clean_wand1,
            milk_clean_wand2,
            milk_clean_wand_dsgn,
            milk_purge_wand_after1,
            milk_purge_wand_after2,
            milk_purge_wand_after_dsgn,
            milk_total1,
            milk_total2,
            milk_total_dsgn,
            hygiene_clean_wand,
            hygiene_total,
            performance_org_workspace,
            performance_overall,
            performance_total,
            total_score,
        } = req.body;

        const newScore = await Score.create({
            eventId,
            espresso_flush_head1,
            espresso_flush_head2,
            espresso_flush_head_dsgn,
            espresso_dry_filter1,
            espresso_dry_filter2,
            espresso_dry_filter_dsgn,
            espresso_spill1,
            espresso_spill2,
            espresso_spill_dsgn,
            espresso_dosing1,
            espresso_dosing2,
            espresso_dosing_dsgn,
            espresso_clean_port1,
            espresso_clean_port2,
            espresso_clean_port_dsgn,
            espresso_brew1,
            espresso_brew2,
            espresso_brew_dsgn,
            espresso_extract_time1,
            espresso_extract_time2,
            espresso_extract_time_dsgn,
            espresso_total1,
            espresso_total2,
            espresso_total_dsgn,
            milk_clean_pitcher1,
            milk_clean_pitcher2,
            milk_clean_pitcher_dsgn,
            milk_purge_wand_before1,
            milk_purge_wand_before2,
            milk_purge_wand_before_dsgn,
            milk_clean_wand1,
            milk_clean_wand2,
            milk_clean_wand_dsgn,
            milk_purge_wand_after1,
            milk_purge_wand_after2,
            milk_purge_wand_after_dsgn,
            milk_total1,
            milk_total2,
            milk_total_dsgn,
            hygiene_clean_wand,
            hygiene_total,
            performance_org_workspace,
            performance_overall,
            performance_total,
            total_score,
        });

        res.status(201).json(newScore);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getScores = async (req, res) => {
    try {
        const scores = await Score.findAll();
        res.status(200).json(scores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getScoreById = async (req, res) => {
    try {
        const id = req.params.id;
        const score = await Score.findByPk(id);

        if (!score) {
            return res.status(404).json({ message: "Score not found." });
        }
        res.status(200).json(score);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteScore = async (req, res) => {
    const id = req.params.id;

    try {
        const num = await Score.destroy({
            where: { id: id }
        });

        if (num == 1) {
            res.send({ message: "Score was deleted successfully!" });
        } else {
            res.send({ message: `Cannot delete Score with id=${id}. Maybe Score was not found!` });
        }
    } catch (err) {
        res.status(500).send({ message: `Could not delete Score with id=${id}` });
    }
};

exports.updateScore = async (req, res) => {
    const id = req.params.id;
    const scoreData = req.body;

    try {
        const [num] = await Score.update(scoreData, {
            where: { id: id }
        });

        if (num == 1) {
            res.send({ message: "Score was updated successfully." });
        } else {
            res.send({ message: `Cannot update Score with id=${id}. Maybe Score was not found or req.body is empty!` });
        }
    } catch (err) {
        res.status(500).send({ message: `Error updating Score with id=${id}` });
    }
};

exports.searchScores = async (req, res) => {
    const { field, value } = req.body;

    try {
        const scores = await Score.findAll({
            where: {
                [field]: {
                    [Op.like]: `%${value}%`
                }
            }
        });

        if (scores.length === 0) {
            return res.status(404).json({ message: "Scores not found." });
        } else {
            res.status(200).json(scores);
        }
    } catch (error) {
        res.status(500).send({ message: `Error retrieving Scores with ${field}=${value}` });
    }
};