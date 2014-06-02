<?php
//This is where all the database qeries come to chill out relax.

class database
{
	private $Obj_MySQLi = null;
	private $Obj_Model = null;
	private $Arr_Loaded = array();
	private $Obj_BBCParser = null;

	//Database query.
	private $Arr_Query = array(
		'location'		=> 'localhost',
		'username'		=> 'root',
		'password'		=> '',
		'database'		=> 'replaceport',
		'type'			=> '',
		'table'			=> '',
		'schema'		=> array(),
		'values'		=> array(),
		'where'			=> array(),
		'limit'			=> array(),
		'order'			=> array(),
		'group'			=> false);


	public function __construct()
	{
		require_once(CONST_STR_DIR_DOMAIN.'/models.php');
		require_once(CONST_STR_DIR_DOMAIN.'/libraries/nbbc.php');

		if (!$Obj_Connection = $this->open($this->Arr_Query))
		{
			print 'Database connection failed'; die;
		}

		$this->Obj_MySQLi = $Obj_Connection;
		$this->Obj_BBCParser = new BBCode;
	}

	public function __destruct()
	{
		$this->close($this->Obj_MySQLi);
	}

	public function open($Arr_Query)
	{

		$Obj_Connection = new mysqli($Arr_Query['location'], $Arr_Query['username'], $Arr_Query['password'], $Arr_Query['database']);
		return $Obj_Connection;
	}

	public function close($Obj_Connection)
	{
		$Obj_Connection->close();
	}

	public function load($Sr_Include)
	{
		if (!in_array($Sr_Include, $this->Arr_Loaded))
		{
			require_once(CONST_STR_DIR_DOMAIN.'/'.$Sr_Include);
			$this->Arr_Loaded[] = $Sr_Include;
		}
		return;
	}

	public function reset($Arr_Query)
	{
		if (!is_array($Arr_Query))
		{
			$Arr_Query = array();
		}

		$Arr_Query['type'] = '';
		$Arr_Query['table'] = '';
		$Arr_Query['schema'] = array();
		$Arr_Query['values'] = array();
		$Arr_Query['where'] = array();
		$Arr_Query['limit'] = array();
		$Arr_Query['order'] = false;
		$Arr_Query['group'] = false;

		return $Arr_Query;
	}

	public function index($Arr_DataRow, $Arr_Query=false)
	{
		$Arr_IndexedRow = array();

		if ($Arr_Query == false)
		{
			$Arr_Query = &$this->Arr_Query;
		}

		//If the table is not set.
		if (!isset($Arr_Query))
		{
			return false;
		}

		foreach ($Arr_DataRow as $Arr_Index => $Arr_Value)
		{
			$Arr_IndexedRow[$this->column($Arr_Index, $Arr_Query)] = $Arr_Value;
		}

		return $Arr_IndexedRow;
	}

	public function mass_index($Arr_DataRows, $Arr_Query=false)
	{
		$Arr_IndexedRows = array();
		foreach ($Arr_DataRows as $Arr_DataRow)
		{
			$Arr_IndexedRows[] = $this->index($Arr_DataRow, $Arr_Query);
		}

		return $Arr_IndexedRows;
	}

	public function insert($Obj_Connection=false, $Arr_Query=false)
	{
		if (!$Arr_Query)
		{
			$Arr_Query = &$this->Arr_Query;
		}

		if (!$Obj_Connection)
		{
			$Obj_Connection = $this->Obj_MySQLi;
		}

		$Arr_Values = $this->strip($Arr_Schema, $Arr_Values);
		$Arr_Values = $this->clean($Arr_Schema, $Arr_Values);

		$Str_Query = "INSERT INTO `".$Arr_Query['database']."`.`".$Arr_Query['table']."` (".$this->fields($Arr_Query).") VALUES (".$this->values($Arr_Query).");";
		$Mix_Results = $Obj_Connection->query($Str_Query);
		$Arr_Query = $this->reset($Arr_Query);

		return $Mix_Results;
	}

	public function select($Arr_Query=false, $Obj_Connection=false)
	{
		$Arr_Values = array();
		if (!$Arr_Query)
		{
			$Arr_Query = &$this->Arr_Query;
		}

		if (!$Obj_Connection)
		{
			$Obj_Connection = $this->Obj_MySQLi;
		}

		$Str_Where = '';
		if ($Str_Where = $this->conditions($Arr_Query['where'], 'and', $Arr_Query, $Obj_Connection))
		{
			$Str_Where = ' WHERE '.$Str_Where;
		}

		$Str_Group = '';
		if ($Arr_Query['group'])
		{
			$Str_Group = " GROUP BY `".$Arr_Query['table']."`.`".$Arr_Query['group']."`";
		}

		$Str_Query = "SELECT * FROM `".$Arr_Query['database']."`.`".$Arr_Query['table']."`".$Str_Where.$this->filter($Arr_Limit).$this->arrange($Str_Order).";";
		if ($Mix_Results = $Obj_Connection->query($Str_Query))
		{
			$Int_Row = 0;
			while ($Arr_Row = $Mix_Results->fetch_row())
			{
				$Arr_Values[$Int_Row] = $Arr_Row;
				$Int_Row++;
			}
		}

		$Arr_Query = $this->reset($Arr_Query);
		$Arr_Values = $this->dress($Arr_Query['schema'], $Arr_Values);

		return $Arr_Values;
	}

	public function update($Obj_Connection=false, $Arr_Query=false)
	{
		if (!$Arr_Query)
		{
			$Arr_Query = &$this->Arr_Query;
		}

		if (!$Obj_Connection)
		{
			$Obj_Connection = $this->Obj_MySQLi;
		}

		$Arr_Values = $this->strip($Arr_Schema, $Arr_Values);
		$Arr_Values = $this->clean($Arr_Schema, $Arr_Values);

		$Str_Where = '';
		if ($Str_Where = $this->conditions($Arr_Query['where'], 'and', $Arr_Query, $Obj_Connection))
		{
			$Str_Where = ' WHERE '.$Str_Where;
		}

		$Str_Query = "UPDATE * FROM `".$Arr_Query['database']."`.`".$Arr_Query['table']."`".$Str_Where.$this->filter($Arr_Limit).$this->arrange($Str_Order).";";
		$Mix_Results = $Obj_Connection->query($Str_Query);
		$Arr_Query = $this->reset($Arr_Query);

		return $Mix_Results;
	}

	public function delete($Obj_Connection=false, $Arr_Query=false)
	{
		if (!$Arr_Query)
		{
			$Arr_Query = &$this->Arr_Query;
		}

		if (!$Obj_Connection)
		{
			$Obj_Connection = $this->Obj_MySQLi;
		}

		$Str_Where = '';
		if ($Str_Where = $this->conditions($Arr_Query['where'], 'and', $Arr_Query, $Obj_Connection))
		{
			$Str_Where = " WHERE ".$Str_Where;
		}

		$Str_Query = "DELETE FROM `".$Arr_Query['database']."`.`".$Arr_Query['table']."`".$Str_Table.where($Arr_Where).";";
		$Mix_Results = $Obj_Connection->query($Str_Query);
		$Arr_Query = $this->reset($Arr_Query);

		return $Mix_Results;
	}

	//Gets a results set of table ranked by field value appearance count, order() required
	//$results = $this->table('downloads')->order('project_id', 'desc')->rank();
	//*!*This function will have securty vulnerabilities as it stands
	public function rank($Str_Operator=false, $Int_Threshold=false, $Obj_Connection=false, $Arr_Query=false)
	{
		$Arr_Values = array();
		if (!$Arr_Query)
		{
			$Arr_Query = &$this->Arr_Query;
		}

		if (!$Obj_Connection)
		{
			$Obj_Connection = $this->Obj_MySQLi;
		}

		//If the threshold value is false discard the operator.
		if ($Mix_Value === false)
		{
			$Str_Operator = false;
		}

		//Build top level refine where statement
		$Str_Refine = '';
		if ($Str_Operator)
		{
			$Str_Refine = 'WHERE r.tally ';
			switch($Str_Operator)
			{
				case 'gt': $Str_Refine .= '>'; break;
				case 'lt': $Str_Refine .= '<'; break;
				case 'gte': $Str_Refine .= '>='; break;
				case 'lte': $Str_Refine .= '<='; break;
				case 'in': $Str_Refine .= 'IN'; break;
				default: $Str_Refine .= '=';
			}
		}

		$Str_Refine .= ' '.$Int_Threshold;

		//Build primary lookup where statement
		$Str_Where = '';
		if ($Str_Where = $this->conditions($Arr_Query['where'], 'and', $Arr_Query, $Obj_Connection, 't'))
		{
			$Str_Where = ' WHERE '.$Str_Where;
		}

		//Build top level reuslts ordering
		$Str_Order = '';
		if (isset($Arr_Query['order']['sort']))
		{
			$Str_Order = " ORDER BY `r`.`tally` ".strtoupper($this->Arr_Query['order']['sort']);
		}

		$Str_Query = "SELECT
	`r`.`".$Arr_Query['order']['field']."`,
	`r`.`tally`
FROM
(
	SELECT
    	`t`.`".$Arr_Query['order']['field']."`,
    	count(*) as `tally`
	FROM
    	`".$this->Arr_Query['database']."`.`".$this->Arr_Query['table']."` `t`
    ".$Str_Where."
  	GROUP BY
    	`t`.`".$Arr_Query['order']['field']."`
) `r`
".$Str_Refine."
".$this->filter($Arr_Limit)."
".$Str_Order.";";

		if ($Mix_Results = $Obj_Connection->query($Str_Query))
		{
			$Int_Row = 0;
			while ($Arr_Row = $Mix_Results->fetch_row())
			{
				$Arr_Values[$Int_Row] = $Arr_Row;
				$Int_Row++;
			}
		}

		$Arr_Query = $this->reset($Arr_Query);
		return $Arr_Values;
	}

	public function fields($Arr_Query)
	{
		$Str_Fields = '(';

		foreach($Arr_Query['schema'] as $Str_Key => $Arr_Definition)
		{
			$Str_Fields .= '`'.$Str_Key.'`,';
		}

		$Str_Fields = substr(0, $Str_Fields, count($Str_Fields) - 1);
		$Str_Fields .= ')';
		return $Str_Fields;
	}

	public function values($Arr_Query)
	{
		$Str_Values = '(';

		for ($i = 0; $i < count($Arr_Query['values']); $i++)
		{
			for ($j = 0; $j < count($Arr_Query['values'][$i]); $j++)
			{
				$Str_Values = $Arr_Values[$i][$j].',';
			}
		}

		$Str_Values = substr(0, $Str_Values, count($Str_Values) - 1);
		$Str_Values = ')';
	}

	//Get column name or position .
	public function column($Mix_Column, $Arr_Query=false)
	{
		if ($Arr_Query == false)
		{
			$Arr_Query = $this->Arr_Query;
		}

		if (is_int($Mix_Column))
		{
			$i = 0;
			foreach ($Arr_Query['schema'] as $Str_Field => $Arr_Values)
			{
				if ($i == $Mix_Column)
				{
					return $Str_Field;
				}

				$i++;
			}
		}
		elseif (is_string($Mix_Column))
		{
			$i = 0;
			foreach ($Arr_Query['schema'] as $Str_Field => $Arr_Values)
			{
				if ($Str_Field == $Mix_Column)
				{
					return $i;
				}

				$i++;
			}
		}

		return false;
	}

	//Set the model
	public function table($Str_Table=false)
	{
		if ($Str_Table)
		{
			$Obj_Model = new $Str_Table();
			$this->Arr_Query['schema'] = $Obj_Model->Arr_Schema;
			$this->Arr_Query['table'] = $Str_Table;
		}
		else
		{
			$this->Arr_Query['table'] = false;
		}

		return $this;
	}

	//Set the query conditions
	public function where($Arr_Where=false)
	{
		if ($Arr_Where)
		{
			if ($this->Arr_Query['where'])
			{
				$this->Arr_Query['where']['and'] = array_merge($this->Arr_Query['where']['and'], $Arr_Where);
			}
			else
			{
				$this->Arr_Query['where']['and'][] = $Arr_Where;
			}
		}
		else
		{
			$this->Arr_Query['where'][] = $Arr_Where=false;
		}

		return $this;
	}

	//Set the limit.
	public function limit($Int_Offset, $Int_Limit=false)
	{
		if ($Int_Limit)
		{
			$this->Arr_Query['limit']['range'] = $Int_Limit;
			$this->Arr_Query['limit']['offset'] = ($Int_Offset != false)? $Int_Offset: 0;
		}
		else
		{
			$this->Arr_Query['limit']['range'] = ($Int_Offset)? $Int_Offset: false;
		}

		return $this;
	}
	
	public function group($Str_Field)
	{
		$this->Arr_Query['group'] = ($Str_Field)? $Str_Field: false;
		return $this;
	}

	//Set the order of the query.
	public function order($Str_Field, $Str_Sort='asc')
	{
		if ($Str_Field == false || $Str_Sort == false)
		{
			$this->Arr_Query['order'] = false;
		}
		else
		{
			$this->Arr_Query['order']['field'] = $Str_Field;

			switch (strtolower($Str_Sort))
			{
				case 'd': case 'desc': $this->Arr_Query['order']['sort'] = 'desc'; break;
				case 'a': case 'asc': default: $this->Arr_Query['order']['sort'] = 'asc'; break;
			}
		}

		return $this;
	}

	//this is an untested short circuit wrapper.
	public function query($Bol_Memory=false)
	{
		$Mix_Results = '';

		if ($this->Arr_Query['type'])
		{
			switch ($this->Arr_Query['type'])
			{
				case 'insert': $Mix_Results = $this->insert($this->Obj_MySQLi, $this->Arr_Query); break;
				case 'select': $Mix_Results = $this->select($this->Obj_MySQLi, $this->Arr_Query); break;
				case 'update': $Mix_Results = $this->update($this->Obj_MySQLi, $this->Arr_Query); break;
				case 'delete': $Mix_Results = $this->delete($this->Obj_MySQLi, $this->Arr_Query); break;
			}
		}

		//*!*This is being moved straight into the query functions
		//move this to head of function as a setter directive
		if (!$Bol_Memory)
		{
			$this->Arr_Query = $this->reset($this->Arr_Query);
		}

		return $Mix_Results;
	}

	//Pull out potentially malicious data.
	public function strip($Arr_Schema, $Arr_Values)
	{
		//Pull out all html.
		for ($i = 0; $i < count($Arr_Schema); $i++)
		{
			for ($j = 0; $j < count($Arr_Schema[$i]); $j++)
			{
				switch($Arr_Schema[$j])
				{
					case 'CHAR': case 'VARCHAR': case 'TINYTEXT': case 'TEXT': case 'MEDIUMTEXT': case 'VARCHAR':
						$Arr_Values[$i][$j] = strip_tags($Arr_Values[$i][$j]);
					case 'DATETIME':
						if (!is_string($Arr_Values[$i][$j]) || !preg_match(REG_SYSTEM_DATETIME, $Arr_Values[$i][$j]))
						{
							$Arr_Values[$i][$j] = '';
						}
					break;
				}
			}
		}

		return $Arr_Values;
	}

	//Prepare data for insertion.
	public function clean($Arr_Schema, $Arr_Values)
	{
		for ($i = 0; $i < count($Arr_Values); $i++)
		{
			for ($j = 0; $j < count($Arr_Values[$i]); $j++)
			{
				switch($Arr_Schema[$j])
				{
					//Add slashes.
					case 'CHAR': case 'VARCHAR': case 'TINYTEXT': case 'TEXT': case 'MEDIUMTEXT': case 'VARCHAR':
						$Arr_Values[$i][$j] = $Obj_MySQLi->mysqli_real_escape_string($Arr_Values[$i][$j]);

					//Wrap in quotes.
					case 'CHAR': case 'VARCHAR': case 'TINYTEXT': case 'TEXT': case 'MEDIUMTEXT': case 'VARCHAR':
					case 'TINYINT': case 'SMALLINT': case 'INT': case 'BIGINT':
					case 'DECIMAL': case 'FLOAT': case 'DOUBLE': case 'REAL':
					case 'DATE': case 'DATETIME': case 'TIME': case 'YEAR':
						$Arr_Values[$i][$j] = "'".$Arr_Values[$i][$j]."'";

					//Set defaults and null values.
				}
			}
		}

		return $Arr_Values;
	}

	//Format data for display transport.
	public function dress($Arr_Schema, $Arr_Values)
	{
		for ($i = 0; $i < count($Arr_Schema); $i++)
		{
			for ($j = 0; $j < count($Arr_Schema[$i]); $j++)
			{
				$Arr_Values[$i][$j] = htmlentities($Arr_Values[$i][$j]);
				$Arr_Values[$i][$j] = $Obj_BBCParser->Parse($$Arr_Values[$i][$j]);
			}
		}

		return $Arr_Values;
	}

	//Builds where clause in query statement.
	public function conditions($Arr_WhereSet, $Str_Group='and', $Arr_Query, $Obj_Connection, $Str_Label=false)
	{
		$Str_Condition = '';
		$Arr_Conditions = array();

		//Loop through where set and build condition group.
		$Arr_ConditionKeys = array_keys($Arr_WhereSet);
		$Int_Length = count($Arr_ConditionKeys);
		for ($i = 0; $i < $Int_Length; $i++)
		{
			//If the first position is not a group marker build set.
			if ((is_int($Arr_ConditionKeys[$i])) && count($Arr_WhereSet[$Arr_ConditionKeys[$i]]) > 1)
			{
				//Column name.
				if ($Str_Label != false)
				{
					$Str_Statement = ' `'.$Str_Label.'`.`'.$Arr_WhereSet[$Arr_ConditionKeys[$i]][0].'` ';
				}
				else
				{
					$Str_Statement = ' `'.$Arr_Query['table'].'`.`'.$Arr_WhereSet[$Arr_ConditionKeys[$i]][0].'` ';
				}

				//Condition type.
				switch ($Arr_WhereSet[$Arr_ConditionKeys[$i]][1])
				{
					case 'gt': $Str_Statement .= '>'; break;
					case 'lt': $Str_Statement .= '<'; break;
					case 'gte': $Str_Statement .= '>='; break;
					case 'lte': $Str_Statement .= '<='; break;
					case 'in': $Str_Statement .= 'IN'; break;
					default: $Str_Statement .= '=';
				}

				//If building an IN comparison assemble matching values.
				if ($Arr_WhereSet[$Arr_ConditionKeys[$i]][1] == 'in')
				{
					//If the IN values are an array build value set.
					if (is_array($Arr_WhereSet[$Arr_ConditionKeys[$i]][2]))
					{
						$Str_Statement .= " (";
						$Arr_InsKeys = array_keys($Arr_WhereSet[$Arr_ConditionKeys[$i]][2]);
						$Int_InsNumb = count($Arr_InsKeys);
						for($j = 0; $j < $Int_InsNumb; $j++)
						{
							//If the condition is set then make database statement.
							if (isset($Arr_WhereSet[$Arr_ConditionKeys[$i]][2][$Arr_InsKeys[$j]]))
							{
								//If the condition parameter is not a string or an integer handle excpetion.
								if ((!is_string($Arr_WhereSet[$Arr_ConditionKeys[$i]][2][$Arr_InsKeys[$j]]))
								&& (!is_int($Arr_WhereSet[$Arr_ConditionKeys[$i]][2][$Arr_InsKeys[$j]])))
								{
									echo 'Where condition '.$Arr_WhereSet[$Arr_ConditionKeys[$i]][2][$Arr_InsKeys[$j]].' not a string'; die;
								}
								else
								{
									$Str_Statement .= "'".$Obj_Connection->real_escape_string($Arr_WhereSet[$Arr_ConditionKeys[$i]][2][$Arr_InsKeys[$j]])."'";
									$Str_Statement .= ($j < $Int_InsNumb - 1)? ", ": "";
								}
							}
							//Otherwise handle excpetion.
							else
							{
								var_dump($Arr_WhereSet[$Arr_ConditionKeys[$i]]);exit;
							}
						}

						$Str_Statement .= ")";
					}
					//Otherwise handle exception.
					else
					{
						print 'Where condition IN values are not an array'; die;
					}
				}
				//Otherwise build standard comparison statement.
				else
				{
					//*!*I ned to test that these array keys exist and if they don't handle the excpetion
					if ($Arr_Query['schema'][$Arr_WhereSet[$Arr_ConditionKeys[$i]][0]]['type'] == 'VARCHAR'
					|| $Arr_Query['schema'][$Arr_WhereSet[$Arr_ConditionKeys[$i]][0]]['type'] == 'TEXT'
					|| $Arr_Query['schema'][$Arr_WhereSet[$Arr_ConditionKeys[$i]][0]]['type'] == 'BLOB'
					|| $Arr_Query['schema'][$Arr_WhereSet[$Arr_ConditionKeys[$i]][0]]['type'] == 'INT'
					|| $Arr_Query['schema'][$Arr_WhereSet[$Arr_ConditionKeys[$i]][0]]['type'] == 'FLOAT'
					|| $Arr_Query['schema'][$Arr_WhereSet[$Arr_ConditionKeys[$i]][0]]['type'] == 'DATETIME')
						$Str_Statement .= " '".$Obj_Connection->real_escape_string($Arr_WhereSet[$Arr_ConditionKeys[$i]][2])."' ";
					else
					{
						$Str_Statement .= ' '.$Arr_WhereSet[$Arr_ConditionKeys[$i]][2];
					}
				}

				$Arr_Conditions[] = $Str_Statement;
			}
			//Otherwise build group.
			else
			{
				$Arr_Conditions[] = $this->conditions($Arr_WhereSet[$Arr_ConditionKeys[$i]], $Arr_ConditionKeys[$i], $Arr_Query, $Obj_Connection, $Str_Label);
			}
		}

		//Assemble each condition statement into a group.
		if (count($Arr_Conditions) > 1)
		{
			$Str_Condition .= '('.implode(' '.strtoupper($Str_Group).' ', $Arr_Conditions).')';
		}
		else
		{
			//*!*This can create an empty condition and should be validated when the where is set to the query
			//I would say that it is the job of the driver to make this test and modify the array structure accordingly
			//I believe this is being done for AND conditions but not the OR condition.
			if (isset($Arr_Conditions[0]) && $Arr_Conditions[0])
			{
				$Str_Condition = $Arr_Conditions[0];
			}
		}

		return $Str_Condition;
	}

	public function filter($Arr_Limit)
	{
		//Hard limit with offset
		$Int_HardLimit = 18446744073709551615;
		$Str_Limit = '';

		if ($Arr_Limit['offset'])
		{
			$Arr_Limit['range'] = (!$Arr_Limit['range'])? $Int_HardLimit: $Arr_Limit['range'];
			$Str_Limit = " LIMIT ".$Arr_Limit['offset'].", ".$Arr_Limit['range'];
		}
		elseif ($Arr_Limit['range'])
		{
			$Str_Limit = " LIMIT ".$Arr_Limit['range'];
		}

		return $Str_Limit;
	}

	public function arrange($Str_Order)
	{
		$Str_Order = ($Str_Order)? " ORDER BY `".$Str_Order['field']."` ".strtoupper($Str_Order['sort']): '';
		return $Str_Order;
	}
	
}

