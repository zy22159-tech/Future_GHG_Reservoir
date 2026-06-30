# Future GHG Reservoir

This repository contains Jupyter notebook scripts for training reservoir greenhouse gas emission models and estimating future reservoir emissions.

## Files

- `Model_training.ipynb` - trains and evaluates machine-learning models for CO2 diffusive, CH4 diffusive, CH4 bubbling, and CH4 degassing pathways.
- `Future reservoirs emissions rate prediction.ipynb` - applies selected model settings to future reservoir datasets and calculates total greenhouse gas emissions.
- `Data/` - input data folder.

## Data

The datasets used by these notebooks are available on Figshare: https://figshare.com/s/f5b16ec287b69c9b15ab

Download the Figshare dataset package and place the required CSV files in the `Data/` folder before running the notebooks.

The current notebooks reference the following input files:

- `Data/Measurment_dataset.csv`
- `Data/decadal_average_dataset.csv`
- `Data/pipline_2015_2050_dataset.csv`
- `Data/pipline_2091_2100_dataset.csv`
- `Data/GHD_2015_2050_dataset.csv`
- `Data/GHD_2091_2100_dataset.csv`

Check the file names after downloading the Figshare data. If a filename differs, either rename the file in `Data/` or update the corresponding `pd.read_csv(...)` line in the notebook.

## Python Environment

Use Python 3 with Jupyter Notebook or JupyterLab. Install the required packages with:

```powershell
pip install pandas numpy scikit-learn xgboost jupyter
```

If you use plots or extend the notebooks with plotting cells, also install:

```powershell
pip install matplotlib seaborn
```

Start Jupyter from the repository root:

```powershell
jupyter notebook
```

Then open and run the notebooks from the Jupyter interface.

## Running `Model_training.ipynb`

Purpose: train and compare models for measured reservoir emission pathways.

Required inputs:

- `Data/Measurment_dataset.csv`

Steps:

1. Start Jupyter from the repository root.
2. Open `Model_training.ipynb`.
3. Confirm the required input files are in `Data/`.
4. Run the setup, helper-function, and data-loading cells.
5. Run the model sections in order:
   - `CO2_diffusive`
   - `CH4_diffusive`
   - `CH4 Ebullitive`
6. Review the printed best parameters and evaluation metrics.

Notes:

- The notebook uses `GridSearchCV`, so full execution can take a long time.
- The notebook prints results in the notebook output. It does not currently save trained model files.


## Running `Future reservoirs emissions rate prediction.ipynb`

Purpose: estimate future reservoir emission rates and total emissions for different future reservoir datasets.

Required training input:

- `Data/Measurment_dataset.csv`

Main future-emissions input:

- `Data/decadal_average_dataset.csv`

Optional future-emissions inputs included in the notebook:

- `Data/pipline_2015_2050_dataset.csv`
- `Data/pipline_2091_2100_dataset.csv`
- `Data/GHD_2015_2050_dataset.csv`
- `Data/GHD_2091_2100_dataset.csv`

Steps:

1. Start Jupyter from the repository root.
2. Open `Future reservoirs emissions rate prediction.ipynb`.
3. Confirm the required data files are in `Data/`.
4. Run the import and data-loading cells.
5. Select the future dataset to process. The notebook currently loads `Data/decadal_average_dataset.csv` by default, while the other future datasets are present as commented alternatives.
6. Run the modelling cells for:
   - CO2 diffusive emissions
   - CH4 diffusive emissions
   - CH4 bubbling emissions
   - CH4 degassing emissions
7. Run the emission-rate estimation cells.
8. Run the total-emissions cells to calculate:
   - `total_emissions_ghg_rate_gco2_m_2_yr`
   - `total_emissions_Gg_yr`

Expected result:

- The notebook adds predicted pathway emissions and total emissions as new columns in the in-memory dataframe `df`.

## Running from the Command Line

You can execute notebooks without opening the browser by using `nbconvert`:

```powershell
jupyter nbconvert --to notebook --execute "Model_training.ipynb" --output "Model_training.executed.ipynb"
jupyter nbconvert --to notebook --execute "Future reservoirs emissions rate prediction.ipynb" --output "Future reservoirs emissions rate prediction.executed.ipynb"
```

Command-line execution is useful for reproducibility, but interactive Jupyter execution is easier when selecting among the alternative future datasets.

## Troubleshooting

- `FileNotFoundError`: make sure the Figshare datasets have been downloaded and placed in `Data/`.
- Filename mismatch: check spelling carefully. For example, the notebook currently references `Data/Measurment_dataset.csv`.
- Slow training: reduce the parameter grids or run one emission pathway section at a time.
- Import errors: confirm that all required Python packages are installed in the active Python environment.
